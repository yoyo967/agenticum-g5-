
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import LandingPage from './components/LandingPage';
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
  const [showOS, setShowOS] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(false);
  
  const abortControllerRef = useRef<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = (showOS || isBooting) ? 'hidden' : 'auto';
  }, [showOS, isBooting]);

  const logToTrace = useCallback((sender: TraceEntry['sender'], content: string, metadata?: any) => {
    setTraceEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sender, content, type: 'text', metadata
    }]);
  }, []);

  const updateNodeStatus = useCallback((id: string, status: NodeStatus, load?: number) => {
    if (!id) return;
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status, load: load ?? n.load } : n));
  }, []);

  // Define handleAbort to resolve the "Cannot find name 'handleAbort'" error on line 172.
  // This function allows users to cancel an active swarm operation via the GATESOverlay.
  const handleAbort = useCallback(() => {
    abortControllerRef.current = true;
    setIsGatesActive(false);
    setMissionActive(false);
    logToTrace('SYSTEM', 'MISSION_ABORTED: Tactical override initiated. Swarm halted.');
    // Set all nodes back to online if they were processing
    setNodes(prev => prev.map(n => n.status === NodeStatus.PROCESSING ? { ...n, status: NodeStatus.ONLINE, load: 5 } : n));
  }, [logToTrace]);

  const runProductionSwarm = async (plan: StrategicObjective[], initialFiles?: FileData[]) => {
    setMissionActive(true);
    setObjectives(plan);
    setIsGatesActive(true);
    setGatesStep('ANALYSIS');
    abortControllerRef.current = false;

    try {
      for (const task of plan) {
        if (abortControllerRef.current) break;
        if (!task.assignedNode) continue;
        
        updateNodeStatus(task.assignedNode, NodeStatus.PROCESSING, 98);
        logToTrace('SYSTEM', `SWARM_CORE: Activating node ${task.assignedNode}...`);
        
        try {
          const output = await executeNodeAction(task.description, { nodeId: task.assignedNode }, false, mirrorMode, task.type, initialFiles);
          
          if (output.status === 'error') {
            logToTrace('SYSTEM', `NODE_HALTED [${task.assignedNode}]: ${output.data}`);
            setObjectives(prev => prev.map(o => o.id === task.id ? { ...o, status: 'HALTED' } : o));
          } else {
            if (output.artifacts && output.artifacts.length > 0) {
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
              logToTrace('AGENT', `ARTIFACT_STORED: ${task.label} from ${task.assignedNode}`);
            }
            setObjectives(prev => prev.map(o => o.id === task.id ? { ...o, status: 'COMPLETED', progress: 100 } : o));
          }
        } catch (err: any) {
          logToTrace('SYSTEM', `NODE_CRASH: ${task.assignedNode} - ${err.message}`);
        } finally {
          updateNodeStatus(task.assignedNode, NodeStatus.ONLINE, 5);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!abortControllerRef.current) {
        setGatesStep('SOVEREIGN');
      }
    } finally {
      setIsGatesActive(false);
      setMissionActive(false);
      if (!abortControllerRef.current && assets.length > 0) {
        setIsFinalizing(true);
        audioService.playSuccess();
      }
    }
  };

  const handleExecute = async (command: string, files?: FileData[]) => {
    logToTrace('USER', `COMMAND_UPLINK: ${command}`);
    setIsThinking(true);
    updateNodeStatus('SN-00', NodeStatus.PROCESSING, 95);

    try {
      const result = await executeNodeAction(`MISSION_COMPILATION: ${command}`, { nodeId: 'SN-00' }, true, mirrorMode, undefined, files);
      
      if (result.status === 'error') {
        throw new Error(result.data);
      }

      if (result.plan && result.plan.length > 0) {
        logToTrace('SYSTEM', `PLAN_VERIFIED: Orchestrating ${result.plan.length} nodes.`);
        runProductionSwarm(result.plan, files);
      } else {
        logToTrace('SYSTEM', 'KERNEL_ORCHESTRATION_ERROR: No valid objectives found in mission plan.');
      }
    } catch (e: any) {
      logToTrace('SYSTEM', `KERNEL_ERROR: ${e.message}`);
      audioService.playError();
    } finally {
      setIsThinking(false);
      updateNodeStatus('SN-00', NodeStatus.ONLINE, 5);
    }
  };

  if (isBooting) return <BootSequence onComplete={() => setIsBooting(false)} />;
  if (!showOS) return <LandingPage onEnter={() => { audioService.playEnter(); setShowOS(true); }} />;

  return (
    <div className={`flex flex-col h-screen bg-void text-chrome font-sans overflow-hidden select-none relative ${mirrorMode ? 'mirror-mode' : ''}`}>
      <NeuralInterfacer isThinking={isThinking || missionActive} entropy={0.042} />
      <header className="h-14 border-b border-steel bg-obsidian/95 flex items-center justify-between px-8 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-9 h-9 bg-neon flex items-center justify-center cursor-pointer shadow-[0_0_20px_#00f0ff44]" onClick={() => setShowOS(false)}>
            <span className="text-void font-black text-lg">G5</span>
          </div>
          <h1 className="text-[11px] font-black uppercase tracking-[0.6em]">Agenticum G5 // Sovereign_OS</h1>
        </div>
        <div className="flex gap-4 p-1 bg-void border border-steel/30">
           <button onClick={() => setViewMode(viewMode === 'TRACE' ? 'TOPOLOGY' : 'TRACE')} className="px-5 py-1.5 text-[9px] font-black uppercase tracking-widest text-neon border border-neon/30 hover:bg-neon/10 transition-all">
             {viewMode === 'TRACE' ? 'TOPOLOGY_VIEW' : 'TRACE_VIEW'}
           </button>
           <button onClick={() => setIsLiveIntercomOpen(true)} className="px-5 py-1.5 text-[9px] font-black uppercase tracking-widest text-warning border border-warning/30 hover:bg-warning/10 transition-all">Live_Intercom</button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden relative">
        <NodeGrid nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
        <main className="flex-1 flex flex-col bg-void relative min-w-0">
          <SovereignHUD confidence={99.9} entropy={0.0421} activeNodes={nodes.filter(n => n.status !== NodeStatus.ONLINE).length} activeNodesTotal={52} contextUsage={0} mirrorMode={mirrorMode} onToggleMirror={() => setMirrorMode(!mirrorMode)} />
          <div className="flex-1 relative overflow-hidden">
            {viewMode === 'TRACE' ? <ReasoningTrace entries={traceEntries} isThinking={isThinking} /> : <TopologyView nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} objectives={objectives} isThinking={isThinking} missionActive={missionActive} mirrorMode={mirrorMode} />}
            <GATESOverlay isActive={isGatesActive} step={gatesStep} nodeId={activeNodeId} onAbort={handleAbort} />
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
