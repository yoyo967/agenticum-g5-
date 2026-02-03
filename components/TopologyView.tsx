
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { AgentNode, NodeStatus, ClusterType, StrategicObjective } from '../types';
import { CLUSTERS } from '../constants';

interface TopologyViewProps {
  nodes: AgentNode[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
  objectives: StrategicObjective[];
  isThinking: boolean;
  missionActive: boolean;
  mirrorMode?: boolean;
}

const TopologyView: React.FC<TopologyViewProps> = ({ 
  nodes, 
  activeNodeId, 
  onSelectNode, 
  objectives, 
  isThinking, 
  missionActive,
  mirrorMode = false
}) => {
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>(0);

  const animate = (t: number) => {
    setTime(t / 1000);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const layout = useMemo(() => {
    return nodes.map((node, i) => {
      let baseRadius = 0;
      let clusterIndex = Object.keys(CLUSTERS).indexOf(node.cluster);
      switch(node.cluster) {
        case 'APEX': baseRadius = 0; break;
        case 'STRATEGY': baseRadius = 140; break;
        case 'INTELLIGENCE': baseRadius = 240; break;
        case 'CREATION': baseRadius = 340; break;
        default: baseRadius = 450; break;
      }
      const angle = (i / nodes.length) * Math.PI * 2 + (clusterIndex * 0.5);
      return { ...node, angle, baseRadius, clusterIndex };
    });
  }, [nodes]);

  const animatedNodes = layout.map(n => {
    const isActiveInMission = objectives.some(obj => obj.assignedNode === n.id && (obj.status === 'ACTIVE' || obj.status === 'COMPLETED' || obj.status === 'PENDING'));
    const isProcessing = n.status === NodeStatus.PROCESSING;
    const baseSpeed = 0.05 + (n.clusterIndex * 0.02);
    const rotationAngle = n.angle + (time * baseSpeed);
    const float = Math.sin(time * 0.8 + n.angle) * (missionActive ? 25 : 10);
    
    return {
      ...n,
      isActiveInMission,
      isProcessing,
      x: 500 + Math.cos(rotationAngle) * (n.baseRadius + float),
      y: 500 + Math.sin(rotationAngle) * (n.baseRadius + float),
    };
  });

  const apex = animatedNodes.find(n => n.cluster === 'APEX') || animatedNodes[0];

  return (
    <div className="relative w-full h-full bg-void overflow-hidden select-none cursor-crosshair font-mono">
      <div className={`absolute inset-0 transition-all duration-1000 ${mirrorMode ? 'bg-[radial-gradient(circle_at_center,_#aa00ff22_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,_#00f0ff22_0%,transparent_70%)]'}`} />
      
      <svg viewBox="0 0 1000 1000" className="w-full h-full p-10 scale-[1.05]">
        <defs>
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Regular Connections */}
        <g>
          {animatedNodes.map((node) => {
            if (node.cluster === 'APEX') return null;
            const isPathActive = node.isActiveInMission || node.isProcessing;
            return (
              <React.Fragment key={`conn-group-${node.id}`}>
                <line 
                  x1={apex.x} y1={apex.y} x2={node.x} y2={node.y} 
                  stroke={isPathActive ? (mirrorMode ? "#aa00ff" : "#00f0ff") : "#222"} 
                  strokeWidth={isPathActive ? "1" : "0.5"} 
                  opacity={isPathActive ? "0.4" : "0.1"}
                  className="transition-all duration-700"
                />
                
                {/* Neural Traffic Particles */}
                {isPathActive && (
                  <circle r="2" fill={mirrorMode ? "#aa00ff" : "#00f0ff"} filter="url(#neon-glow)">
                    <animateMotion 
                      dur={`${1 + Math.random() * 2}s`} 
                      repeatCount="indefinite"
                      path={`M${apex.x},${apex.y} L${node.x},${node.y}`}
                    />
                  </circle>
                )}
              </React.Fragment>
            );
          })}
        </g>

        {/* Nodes */}
        {animatedNodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isBusy = node.isProcessing || node.isActiveInMission;
          
          return (
            <g key={node.id} onClick={() => onSelectNode(node.id)} className="cursor-pointer group">
              {/* Pulse effect for active nodes */}
              {isBusy && (
                <rect 
                  x={node.x - 12} y={node.y - 12} width="24" height="24"
                  fill="none" stroke={mirrorMode ? '#aa00ff' : '#00f0ff'} strokeWidth="1"
                  className="animate-ping opacity-20"
                />
              )}

              <rect 
                x={node.x - 7} y={node.y - 7} width="14" height="14"
                fill={isActive ? (mirrorMode ? '#aa00ff' : '#00f0ff') : '#111'}
                stroke={isActive ? '#fff' : mirrorMode ? '#aa00ff' : '#333'}
                strokeWidth={isActive ? "2" : "1"}
                className="transition-all duration-300"
                transform={`rotate(${time * 45}, ${node.x}, ${node.y})`}
              />
              
              {isActive && (
                <text 
                  x={node.x + 15} y={node.y + 5} 
                  className="text-[12px] fill-chrome font-black uppercase tracking-widest"
                >
                  {node.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-10 left-10 p-6 border border-steel bg-obsidian/40 backdrop-blur-md">
         <div className="flex flex-col gap-2">
            <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.4em]">Mesh_Telemetry</span>
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${missionActive ? 'bg-active animate-pulse shadow-[0_0_15px_#00ff88]' : 'bg-steel opacity-40'}`} />
               <span className="text-xl font-black text-chrome tracking-tighter uppercase">
                 {missionActive ? 'SWARM_TRAFFIC_ACTIVE' : 'IDLE_MONITORING'}
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TopologyView;
