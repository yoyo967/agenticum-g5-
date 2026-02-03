
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import ProvisioningShield from './components/ProvisioningShield';
import GATESOverlay from './components/GATESOverlay';
import NeuralInterfacer from './components/NeuralInterfacer';
import BootSequence from './components/BootSequence';
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
  const [isGatesActive, setIsGatesActive] = useState(false);
  const [gatesStep, setGatesStep] = useState<'GROUNDING' | 'ANALYSIS' | 'TRACKING' | 'EVOLUTION' | 'SOVEREIGN' | null>(null);
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingMission, setPendingMission] = useState<{cmd: string, files?: FileData[]} | null>(null);
  const [viewMode, setViewMode] = useState<'TRACE' | 'TOPOLOGY'>('TRACE');
  const [isBooting, setIsBooting] = useState(true);
  const [processingNode, setProcessingNode] = useState<string>('');

  const [confidence, setConfidence] = useState(99.8);
  const [entropy, setEntropy] = useState(0.0421);

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

  const runParallelSynthesis = async (plan: StrategicObjective[]) => {
    setMissionActive(true);
    setObjectives(plan);
    setIsGatesActive(true);
    setGatesStep('GROUNDING');
    audioService.playProcessing();

    // Gestaffelter Start für UI-Feedback
    const missionPromises = plan.map(async (obj, i) => {
      // Delay pro Node für dramatischen Effekt
      await new Promise(r => setTimeout(r, i * 400));
      
      updateNodeStatus(obj.assignedNode, NodeStatus.PROCESSING, 85);
      setObjectives(prev => prev.map((o, idx) => idx === i ? { ...o, status: 'ACTIVE', progress: 10 } : o));
      
      try {
        setProcessingNode(obj.assignedNode);
        const output = await executeNodeAction(obj.description, { thinkingBudget: 0, maxTokens: 4000, nodeId: obj.assignedNode });
        
        if (output.data === "AUTH_REQUIRED") throw new Error("AUTH_REQUIRED");

        if (output.status === 'success') {
          const newAssets: SessionAsset[] = (output.artifacts || []).map(a => ({
            id: Math.random().toString(36).substr(2, 9),
            type: a.type.toUpperCase() as any,
            url: a.content || '',
            timestamp: new Date().toLocaleTimeString(),
            nodeId: obj.assignedNode,
            label: a.label || obj.label,
            content: a.content,
            grounding: output.grounding
          }));
          
          setAssets(prev => [...prev, ...newAssets]);
          setObjectives(prev => prev.map((o, idx) => idx === i ? { ...o, status: 'COMPLETED', progress: 100 } : o));
          logToTrace('CONSENSUS', `Node ${obj.assignedNode} finalized artifact synthesis.`, { nodeId: obj.assignedNode, grounding: output.grounding });
        } else {
          setObjectives(prev => prev.map((o, idx) => idx === i ? { ...o, status: 'HALTED' } : o));
          logToTrace('SYSTEM', `Node ${obj.assignedNode} failed: ${output.data}`, { nodeId: obj.assignedNode });
        }
      } catch (err: any) {
        if (err.message === "AUTH_REQUIRED") throw err;
        setObjectives(prev => prev.map((o, idx) => idx === i ? { ...o, status: 'HALTED' } : o));
        updateNodeStatus(obj.assignedNode, NodeStatus.WARNING, 0);
      } finally {
        updateNodeStatus(obj.assignedNode, NodeStatus.ONLINE, 5);
      }
    });

    try {
      // GATES Protocol Phasen-Steuerung
      const steps: Array<'GROUNDING' | 'ANALYSIS' | 'TRACKING' | 'EVOLUTION' | 'SOVEREIGN'> = ['GROUNDING', 'ANALYSIS', 'TRACKING', 'EVOLUTION', 'SOVEREIGN'];
      for (const step of steps) {
        setGatesStep(step);
        await new Promise(r => setTimeout(r, 1500));
      }
      
      await Promise.allSettled(missionPromises);
      
      setGatesStep('SOVEREIGN');
      setTimeout(() => {
        setIsGatesActive(false);
        setMissionActive(false);
        setIsFinalizing(true);
        audioService.playSuccess();
      }, 2000);

    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        setIsGatesActive(false);
        setShowAuthModal(true);
      }
    }
  };

  const executeCoreMission = async (command: string, files?: FileData[]) => {
    setIsThinking(true);
    setAssets([]); 
    updateNodeStatus('SN-00', NodeStatus.PROCESSING, 95);
    
    try {
      const output = await executeNodeAction(command, { thinkingBudget: 4000, maxTokens: 2000, nodeId: 'SN-00' }, files);
      if (output.data === "AUTH_REQUIRED") {
        setPendingMission({cmd: command, files});
        setShowAuthModal(true);
      } else if (output.plan) {
        logToTrace('AGENT', `Sovereign Objective Mesh generated. Engaging Parallel Matrix.`, { plan: output.plan });
        runParallelSynthesis(output.plan);
      } else {
        logToTrace('AGENT', output.data || 'Mission sequence initiated.');
      }
    } catch (e: any) {
      logToTrace('SYSTEM', `Core Engine Failure: ${e.message}`);
      audioService.playError();
    } finally {
      setIsThinking(false);
      updateNodeStatus('SN-00', NodeStatus.ONLINE, 10);
    }
  };

  const handleExecute = async (command: string, files?: FileData[]) => {
    audioService.playEnter();
    logToTrace('USER', command);
    // @ts-ignore
    const hasKey = window.aistudio && await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setPendingMission({cmd: command, files});
      setShowAuthModal(true);
    } else {
      executeCoreMission(command, files);
    }
  };

  const handleAuthorize = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setShowAuthModal(false);
    if (pendingMission) {
      executeCoreMission(pendingMission.cmd, pendingMission.files);
      setPendingMission(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(99.8 + (Math.random() * 0.1));
      setEntropy(0.0421 + (Math.random() * 0.005));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isBooting) return <BootSequence onComplete={() => setIsBooting(false)} />;

  return (
    <div className="flex flex-col h-screen bg-void text-chrome font-sans overflow-hidden select-none relative">
      <NeuralInterfacer isThinking={isThinking || missionActive} entropy={entropy} />
      <GATESOverlay isActive={isGatesActive} step={gatesStep} nodeId={processingNode} />
      
      <header className="h-14 border-b border-steel bg-obsidian/95 flex items-center justify-between px-8 z-50 shrink-0 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
        <div className="flex items-center gap-6">
          <div className="w-9 h-9 bg-neon flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] relative overflow-hidden group">
            <span className="text-void font-black text-lg z-10">G5</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[13px] font-black uppercase tracking-[0.6em] text-chrome leading-none">Agenticum G5</h1>
            <span className="text-[7px] text-tungsten font-bold uppercase tracking-[0.4em] mt-1.5 opacity-40">Sovereign_OS // Core_Uplink_v5.0.2</span>
          </div>
        </div>
        <div className="flex gap-4 p-1 bg-void/50 border border-steel/30">
           <button 
             onClick={() => setViewMode('TRACE')} 
             className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'TRACE' ? 'text-neon bg-neon/10' : 'text-tungsten hover:text-chrome hover:bg-white/5'}`}
           >
             Trace_Feed
           </button>
           <button 
             onClick={() => setViewMode('TOPOLOGY')} 
             className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'TOPOLOGY' ? 'text-neon bg-neon/10' : 'text-tungsten hover:text-chrome hover:bg-white/5'}`}
           >
             Mesh_Topology
           </button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden relative">
        <NodeGrid nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
        
        <main className="flex-1 flex flex-col bg-void relative min-w-0">
          <SovereignHUD 
            confidence={confidence} 
            entropy={entropy} 
            activeNodes={nodes.filter(n => n.status !== NodeStatus.ONLINE).length} 
            activeNodesTotal={8} 
            contextUsage={32000} 
          />
          
          <div className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.01)_0%,transparent_100%)]">
            {viewMode === 'TRACE' ? (
              <ReasoningTrace entries={traceEntries} isThinking={isThinking} />
            ) : (
              <TopologyView nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} objectives={objectives} />
            )}
          </div>
          
          <CommandLine 
            onExecute={handleExecute} 
            onToggleLive={() => {}} 
            onOpenDiagnostics={() => {}} 
            isLive={false} 
            isVision={false} 
            disabled={isThinking || missionActive} 
          />
        </main>
        
        <AssetRepository 
          assets={assets} 
          onPreview={setPreviewAsset} 
          onOpenDossier={() => setIsDossierOpen(true)} 
          onRefine={() => {}} 
        />
      </div>

      <AssetPreviewModal asset={previewAsset} onClose={() => setPreviewAsset(null)} onRefine={() => {}} />
      <FinalityProtocol isActive={isFinalizing} onVerified={() => { setIsFinalizing(false); setIsDossierOpen(true); }} />
      <DossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} objectives={objectives} assets={assets} />
      {showAuthModal && <ProvisioningShield onAuthorize={handleAuthorize} />}
    </div>
  );
};

export default App;
