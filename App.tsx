import React, { useState, useEffect, useRef } from 'react';
import { AgentNode, NodeStatus, TraceEntry, DeploymentConfig, ClusterType, FileData } from './types';
import NodeGrid from './components/NodeGrid';
import ReasoningTrace from './components/ReasoningTrace';
import CommandLine from './components/CommandLine';
import LandingPage from './components/LandingPage';
import { executeNodeAction } from './services/geminiService';
import { ICONS, CLUSTERS } from './constants';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const generateNodes = (): AgentNode[] => {
  const nodes: AgentNode[] = [];
  nodes.push({ id: 'SN-00', name: 'The Orchestrator', cluster: 'APEX', status: NodeStatus.ONLINE, load: 12, description: 'Central CNS managing all autonomous agents.' });
  const strategyNames = ['Campaign Strategist', 'Brand Architect', 'Growth Hacker', 'Logic Patcher', 'Hegemony Matrix'];
  strategyNames.forEach((name, i) => nodes.push({ id: `SP-${String(i+1).padStart(2, '0')}`, name, cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 15, description: 'High-reasoning strategy and structural logic.' }));
  const intelNames = ['Authority Auditor', 'SEO Forensic', 'Trend Forecaster', 'The Red Team', 'Adversarial Scanner'];
  intelNames.forEach((name, i) => nodes.push({ id: `RA-${String(i+1).padStart(2, '0')}`, name, cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 10, description: 'Intelligence harvesting with Google Search/Maps grounding.' }));
  const creationNames = ['Copy Chief', 'Social Sniper', 'Video Director', 'Art Director', 'Audio Engineer', 'Creative Autopilot'];
  creationNames.forEach((name, i) => nodes.push({ id: `CC-${String(i+1).padStart(2, '0')}`, name, cluster: 'CREATION', status: NodeStatus.ONLINE, load: 20, description: 'Multimodal content generation (Veo/Imagen/TTS).' }));
  const clusters: ClusterType[] = ['GOVERNANCE', 'FINANCE', 'EDUCATION', 'SPECIAL_OPS'];
  for (let i = nodes.length; i < 52; i++) {
    const cluster = clusters[i % clusters.length];
    nodes.push({ id: `${CLUSTERS[cluster].prefix}-${String(i).padStart(2, '0')}`, name: `${CLUSTERS[cluster].label} Agent ${i}`, cluster, status: Math.random() > 0.95 ? NodeStatus.OFFLINE : NodeStatus.ONLINE, load: 0, description: 'Utility compute resource.' });
  }
  return nodes;
};

const INITIAL_NODES = generateNodes();

const App: React.FC = () => {
  const [showConsole, setShowConsole] = useState(false);
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);
  const [activeNodeId, setActiveNodeId] = useState<string>('SN-00');
  const [traceEntries, setTraceEntries] = useState<TraceEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [sysHex, setSysHex] = useState('0x000000');
  const [config, setConfig] = useState<DeploymentConfig>({
    thinkingBudget: 32768, 
    maxTokens: 4000,
    nodeId: 'SN-00',
    imageSize: '1K',
    aspectRatio: '16:9'
  });

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSysHex(`0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelection = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const logToTrace = (sender: TraceEntry['sender'], content: string, type: TraceEntry['type'] = 'text', metadata?: any) => {
    setTraceEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sender,
      content,
      type,
      metadata
    }]);
  };

  const handleExecute = async (command: string, files?: FileData[]) => {
    const isPaidFeature = command.toLowerCase().includes('video') || command.toLowerCase().includes('animate') || activeNodeId.startsWith('CC');
    if (isPaidFeature && !hasApiKey) {
      logToTrace('SYSTEM', 'AUTHORIZATION_ERROR: Asset generation requires a paid GCP Tier. Configure API Key in dashboard.');
      return;
    }

    logToTrace('USER', command);
    setIsThinking(true);
    
    const originalActiveId = activeNodeId;
    setActiveNodeId('SN-00');
    setNodes(prev => prev.map(n => n.id === 'SN-00' ? { ...n, status: NodeStatus.PROCESSING, load: 95 } : n));
    logToTrace('THOUGHT', "Global CNS mapping intent to optimal execution node...", 'thinking', { nodeId: 'SN-00' });

    try {
      const orchestratorOutput = await executeNodeAction(`As SN-00 Orchestrator, identify the node cluster best suited for: "${command}". Return a logical routing plan.`, { ...config, nodeId: 'SN-00' });
      logToTrace('AGENT', orchestratorOutput.data, 'text', { nodeId: 'SN-00' });

      const targetNodeId = originalActiveId !== 'SN-00' ? originalActiveId : 'SN-00';
      setActiveNodeId(targetNodeId);
      logToTrace('THOUGHT', `Engaging node ${targetNodeId} specialized heuristics...`, 'thinking', { nodeId: targetNodeId });
      setNodes(prev => prev.map(n => n.id === targetNodeId ? { ...n, status: NodeStatus.PROCESSING, load: 90 } : n));
         
      const nodeOutput = await executeNodeAction(command, { ...config, nodeId: targetNodeId }, files);
      logToTrace('AGENT', nodeOutput.data, 'text', { 
        nodeId: targetNodeId, 
        artifacts: nodeOutput.artifacts,
        grounding: nodeOutput.grounding
      });
      
    } catch (error: any) {
        logToTrace('SYSTEM', `COGNITIVE_FAULT: ${error.message || 'Execution halted.'}`, 'text');
        if (error.message?.includes("entity was not found")) setHasApiKey(false);
    } finally {
      setIsThinking(false);
      setNodes(prev => prev.map(n => ({ ...n, status: NodeStatus.ONLINE, load: 5 })));
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      sessionRef.current?.close();
      setIsLive(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputNode = audioContextRef.current.createGain();
      outputNode.connect(audioContextRef.current.destination);
      let nextStartTime = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            logToTrace('SYSTEM', 'LIVE_API: Secure high-fidelity audio bridge established.');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const bytes = new Uint8Array(int16.buffer);
              let binary = '';
              for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
              const base64 = btoa(binary);
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNode);
              nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
            }
          },
          onclose: () => setIsLive(false),
          onerror: () => setIsLive(false),
        },
        config: { 
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are G5-Live. Communicate with tactical precision. Use code identifiers where appropriate."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      logToTrace('SYSTEM', 'LIVE_API: Bridge negotiation failure.');
    }
  };

  if (!showConsole) return <LandingPage onEnter={() => setShowConsole(true)} />;

  return (
    <div className="flex flex-col h-screen bg-obsidian text-chrome font-sans selection:bg-neon selection:text-void overflow-hidden">
      <header className="h-12 border-b border-steel bg-void flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowConsole(false)}>
            <div className="w-5 h-5 bg-neon flex items-center justify-center shadow-[0_0_12px_#00f0ff]">
              <span className="text-void font-black text-xs">G5</span>
            </div>
            <h1 className="text-xs font-bold tracking-[0.4em] uppercase group-hover:text-neon transition-colors">AGENTICUM G5</h1>
          </div>
          <div className="h-4 w-px bg-steel" />
          <div className="flex items-center gap-3 text-[10px] text-tungsten font-mono">
             <div className="flex items-center gap-2 bg-steel/20 px-2 py-0.5 rounded-sm">
               <span className="text-active animate-pulse">●</span>
               <span className="tracking-tighter uppercase">{sysHex}</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {!hasApiKey && (
             <button 
               onClick={handleOpenKeySelection}
               className="text-[9px] font-bold text-active border border-active/50 px-2 py-1 uppercase tracking-widest hover:bg-active hover:text-void transition-all animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.3)]"
             >
               AUTH_PAID_PROJECT
             </button>
          )}
          <div className="flex items-center gap-3">
             <select 
               value={config.imageSize} 
               onChange={(e) => setConfig(p => ({ ...p, imageSize: e.target.value as any }))}
               className="bg-void border border-steel text-[9px] text-tungsten p-1 uppercase focus:border-neon outline-none cursor-pointer"
             >
               <option value="1K">1K_SCALE</option>
               <option value="2K">2K_SCALE</option>
               <option value="4K">4K_SCALE</option>
             </select>
             <select 
               value={config.aspectRatio} 
               onChange={(e) => setConfig(p => ({ ...p, aspectRatio: e.target.value as any }))}
               className="bg-void border border-steel text-[9px] text-tungsten p-1 uppercase focus:border-neon outline-none cursor-pointer"
             >
               <option value="1:1">1:1_SQ</option>
               <option value="9:16">9:16_PT</option>
               <option value="16:9">16:9_LS</option>
               <option value="21:9">21:9_UW</option>
             </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-[9px] text-tungsten uppercase font-bold tracking-widest">Thought_Depth</label>
            <input 
              type="range" min="0" max="32768" step="4096"
              value={config.thinkingBudget}
              onChange={(e) => setConfig(prev => ({ ...prev, thinkingBudget: parseInt(e.target.value) }))}
              className="w-24 h-1 bg-steel appearance-none cursor-pointer accent-neon"
            />
            <span className="text-[10px] text-neon font-mono w-10 text-right">{(config.thinkingBudget/1024).toFixed(0)}K</span>
          </div>
          <ICONS.Shield />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <NodeGrid nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
        <main className="flex-1 flex flex-col bg-obsidian relative">
          <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_4px,4px_100%] shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none"></div>
          
          <div className="flex items-center justify-between px-6 py-3 border-b border-steel bg-void/40 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <ICONS.Terminal />
              <div className="flex flex-col">
                <span className="text-[9px] text-tungsten uppercase tracking-widest">Cognitive_Handshake</span>
                <span className="text-xs text-neon font-mono font-bold tracking-widest">{activeNode.id} // {activeNode.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 ${activeNode.status === NodeStatus.ONLINE ? 'bg-active shadow-[0_0_5px_#00ff88]' : 'bg-warning animate-pulse'}`} />
               <span className="text-[9px] text-tungsten font-mono uppercase tracking-[0.2em]">{activeNode.status}</span>
            </div>
          </div>

          <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
            <ReasoningTrace entries={traceEntries} isThinking={isThinking} />
            <CommandLine onExecute={handleExecute} onToggleLive={toggleLive} isLive={isLive} disabled={isThinking} />
          </div>
        </main>

        <aside className="w-80 border-l border-steel bg-void p-5 hidden xl:flex flex-col gap-8 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon/5 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />
          
          <section className="relative z-10">
            <h3 className="text-[10px] text-tungsten font-bold uppercase tracking-[0.2em] mb-4 border-b border-steel pb-2">Manifest_Protocol</h3>
            <div className="bg-void p-3 font-mono text-[9px] text-tungsten/80 border border-steel/20 h-56 overflow-y-auto scrollbar-hide">
              <pre className="whitespace-pre-wrap leading-relaxed">
{`[HANDSHAKE_LOG]
- Deployment: G5-STRIKE
- Target: ${activeNode.id}
- Latency: 18ms (Direct)
- Buffer: AES-256-GCM
- Thinking: ${config.thinkingBudget > 0 ? 'ENABLED' : 'FAST_AI'}
---
[TELEMETRY_STREAM]
${Array.from({length: 6}).map((_, i) => `NODE_${i+10} ... OK [${(Math.random()*100).toFixed(0)}%]`).join('\n')}
---
[MANIFEST_COMPLETE]
Broadcast: SECURE`}
              </pre>
            </div>
          </section>

          <div className="mt-auto p-4 border border-neon/20 bg-neon/5 relative">
             <div className="flex items-center gap-2 mb-2 text-neon">
                <div className="w-1.5 h-1.5 bg-neon animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 decoration-neon/30">Protocol G5 Nominal</span>
             </div>
             <p className="text-[9px] text-tungsten leading-tight italic opacity-80">Orchestrator SN-00 active. 52-node civilization initialized for end-to-end tactical marketing synthesis. Gemini 3 Pro reasoning fabric confirmed.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
