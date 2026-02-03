
import React, { useState, useCallback } from 'react';
import { AgentNode, NodeStatus, TraceEntry, FileData, SessionAsset, StrategicObjective } from './types';
import NodeGrid from './components/NodeGrid';
import ReasoningTrace from './components/ReasoningTrace';
import TopologyView from './components/TopologyView';
import CommandLine from './components/CommandLine';
import SovereignHUD from './components/SovereignHUD';
import AssetRepository from './components/AssetRepository';
import AssetPreviewModal from './components/AssetPreviewModal';
import FinalityProtocol from './components/FinalityProtocol';
import DossierModal from './components/DossierModal';
import GATESOverlay from './components/GATESOverlay';
import NeuralInterfacer from './components/NeuralInterfacer';
import BootSequence from './components/BootSequence';
import LiveIntercom from './components/LiveIntercom';
import { executeNodeAction } from './services/geminiService';
import { audioService } from './services/audioService';
import { NODE_MANIFEST } from './constants';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<AgentNode[]>(NODE_MANIFEST);
  const [activeNodeId, setActiveNodeId] = useState<string>('SN-00');
  const [traceEntries, setTraceEntries] = useState<TraceEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [assets, setAssets] = useState<SessionAsset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<SessionAsset | null>(null);
  const [missionActive, setMissionActive] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isLiveIntercomOpen, setIsLiveIntercomOpen] = useState(false);
  const [isGatesActive, setIsGatesActive] = useState(false);
  const [gatesStep, setGatesStep] = useState<'GROUNDING' | 'ANALYSIS' | 'TRACKING' | 'EVOLUTION' | 'SOVEREIGN' | null>(null);
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [viewMode, setViewMode] = useState<'TRACE' | 'TOPOLOGY'>('TRACE');
  const [isBooting, setIsBooting] = useState(true);
  const [mirrorMode, setMirrorMode] = useState(false);

  const logToTrace = useCallback((sender: TraceEntry['sender'], content: string, metadata?: any) => {
    setTraceEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sender, content, type: 'text', metadata
    }]);
  }, []);

  const updateNodeStatus = useCallback((id: string, status: NodeStatus, load?: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status, load: load ?? n.load } : n));
  }, []);

  const runProductionSwarm = async (plan: any[], initialFiles?: FileData[]) => {
    setMissionActive(true);
    setObjectives(plan.map(p => ({ ...p, status: 'PENDING', progress: 0 })));
    setIsGatesActive(true);
    setGatesStep('ANALYSIS');

    // Parallel execution - Hard Swarm
    const tasks = plan.map(async (task) => {
      updateNodeStatus(task.assignedNode, NodeStatus.PROCESSING, 98);
      logToTrace('SYSTEM', `SWARM_EXEC: Node ${task.assignedNode} engaging ${task.type}...`);
      
      try {
        const output = await executeNodeAction(task.description, { nodeId: task.assignedNode }, false, mirrorMode, task.type, initialFiles);
        if (output.artifacts) {
          const newAssets: SessionAsset[] = output.artifacts.map(a => ({
            id: Math.random().toString(36).substr(2, 9),
            type: a.type.toUpperCase() as any,
            url: a.content,
            timestamp: new Date().toLocaleTimeString(),
            nodeId: task.assignedNode,
            label: a.label || task.label,
            content: a.content,
            grounding: output.grounding
          }));
          setAssets(prev => [...prev, ...newAssets]);
          logToTrace('MISSION_CONTROL', `ASSET_LOCKED: ${task.label} delivered by ${task.assignedNode}`);
        }
        setObjectives(prev => prev.map(o => o.id === task.id ? { ...o, status: 'COMPLETED', progress: 100 } : o));
      } catch (err) {
        logToTrace('SYSTEM', `ERROR: Node ${task.assignedNode} failed synthesis.`);
      } finally {
        updateNodeStatus(task.assignedNode, NodeStatus.ONLINE, 10);
      }
    });

    await Promise.all(tasks);
    
    setGatesStep('SOVEREIGN');
    await new Promise(r => setTimeout(r, 1500));
    setIsGatesActive(false);
    setMissionActive(false);
    setIsFinalizing(true);
    audioService.playSuccess();
  };

  const handleExecute = async (command: string, files?: FileData[]) => {
    logToTrace('USER', `COMMAND_RECEIVED: ${command}`);
    setIsThinking(true);
    updateNodeStatus('SN-00', NodeStatus.PROCESSING, 95);

    try {
      // APEX PLANNER MUST RETURN JSON
      const result = await executeNodeAction(`COMPILE PRODUCTION SWARM FOR: ${command}`, { nodeId: 'SN-00' }, true, mirrorMode, undefined, files);
      
      if (result.plan && result.plan.length > 0) {
        logToTrace('MISSION_CONTROL', `PLAN_VERIFIED: Deploying ${result.plan.length} nodes for autonomous production.`);
        runProductionSwarm(result.plan, files);
      } else {
        throw new Error("Orchestration Error");
      }
    } catch (e) {
      logToTrace('SYSTEM', 'PLAN_FAILED: Activating Default High-Fidelity Swarm.');
      const emergencyPlan = [
        { id: 'e1', label: 'Intel_Scan', assignedNode: 'RA-01', type: 'RESEARCH', description: `Deep intel for ${command}` },
        { id: 'e2', label: 'Strategy_Blueprint', assignedNode: 'SP-01', type: 'STRATEGY', description: `Sovereign strategy for ${command}` },
        { id: 'e3', label: 'Master_Visual', assignedNode: 'CC-10', type: 'IMAGE', description: `Ultra-high-end visual asset for ${command} in Obsidian & Chrome style.` },
        { id: 'e4', label: 'Cinema_Render', assignedNode: 'CC-06', type: 'VIDEO', description: `Cinematic trailer for ${command} using Veo 3.1 technology.` }
      ];
      runProductionSwarm(emergencyPlan, files);
    } finally {
      setIsThinking(false);
      updateNodeStatus('SN-00', NodeStatus.ONLINE, 10);
    }
  };

  if (isBooting) return <BootSequence onComplete={() => setIsBooting(false)} />;

  return (
    <div className={`flex flex-col h-screen bg-void text-chrome font-sans overflow-hidden select-none relative ${mirrorMode ? 'mirror-mode' : ''}`}>
      <NeuralInterfacer isThinking={isThinking || missionActive} entropy={0.042} />
      <header className="h-14 border-b border-steel bg-obsidian/95 flex items-center justify-between px-8 z-50 shrink-0 shadow-2xl relative">
        <div className="flex items-center gap-6">
          <div className="w-9 h-9 flex items-center justify-center bg-neon shadow-[0_0_30px_#00f0ff44]"><span className="text-void font-black text-lg">G5</span></div>
          <h1 className="text-[11px] font-black uppercase tracking-[0.6em]">Agenticum G5 // Sovereign_Forge_v10.2</h1>
        </div>
        <div className="flex gap-4 p-1 bg-void border border-steel/30">
           <button onClick={() => setIsLiveIntercomOpen(true)} className="px-5 py-1.5 text-[9px] font-black uppercase tracking-widest text-warning border border-warning/30 hover:bg-warning/10">Live_Intercom</button>
           <button onClick={() => setViewMode('TRACE')} className={`px-5 py-1.5 text-[9px] font-black uppercase tracking-widest ${viewMode === 'TRACE' ? 'text-neon bg-neon/10 border-neon border' : 'text-tungsten border border-transparent'}`}>Trace</button>
           <button onClick={() => setViewMode('TOPOLOGY')} className={`px-5 py-1.5 text-[9px] font-black uppercase tracking-widest ${viewMode === 'TOPOLOGY' ? 'text-neon bg-neon/10 border-neon border' : 'text-tungsten border border-transparent'}`}>Topology</button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden relative">
        <NodeGrid nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
        <main className="flex-1 flex flex-col bg-void relative min-w-0">
          <SovereignHUD confidence={99.9} entropy={0.0421} activeNodes={nodes.filter(n => n.status !== NodeStatus.ONLINE).length} activeNodesTotal={52} contextUsage={0} mirrorMode={mirrorMode} onToggleMirror={() => setMirrorMode(!mirrorMode)} />
          <div className="flex-1 relative overflow-hidden">
            {viewMode === 'TRACE' ? <ReasoningTrace entries={traceEntries} isThinking={isThinking} /> : <TopologyView nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} objectives={objectives} isThinking={isThinking} missionActive={missionActive} mirrorMode={mirrorMode} />}
            <GATESOverlay isActive={isGatesActive} step={gatesStep} nodeId={activeNodeId} />
          </div>
          <CommandLine onExecute={handleExecute} onToggleLive={() => {}} onOpenDiagnostics={() => {}} isLive={false} isVision={false} disabled={isThinking || missionActive} />
        </main>
        <AssetRepository assets={assets} onPreview={setPreviewAsset} onOpenDossier={() => setIsDossierOpen(true)} onRefine={() => {}} />
      </div>
      <LiveIntercom isOpen={isLiveIntercomOpen} onClose={() => setIsLiveIntercomOpen(false)} />
      <AssetPreviewModal asset={previewAsset} onClose={() => setPreviewAsset(null)} onRefine={() => {}} />
      <FinalityProtocol isActive={isFinalizing} onVerified={() => { setIsFinalizing(false); setIsDossierOpen(true); }} />
      <DossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} objectives={objectives} assets={assets} />
    </div>
  );
};

export default App;
