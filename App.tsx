
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgentNode, NodeStatus, TraceEntry, DeploymentConfig, FileData, SessionAsset, StrategicObjective } from './types';
import NodeGrid from './components/NodeGrid';
import ReasoningTrace from './components/ReasoningTrace';
import CommandLine from './components/CommandLine';
import LandingPage from './components/LandingPage';
import SovereignHUD from './components/SovereignHUD';
import AssetRepository from './components/AssetRepository';
import AssetPreviewModal from './components/AssetPreviewModal';
import TopologyView from './components/TopologyView';
import { executeNodeAction } from './services/geminiService';
import { ICONS, NODE_MANIFEST } from './constants';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const App: React.FC = () => {
  const [showConsole, setShowConsole] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'MESH'>('GRID');
  const [nodes, setNodes] = useState<AgentNode[]>(NODE_MANIFEST);
  const [activeNodeId, setActiveNodeId] = useState<string>('SN-00');
  const [traceEntries, setTraceEntries] = useState<TraceEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [confidence, setConfidence] = useState(99.8);
  const [entropy, setEntropy] = useState(1.2);
  const [assets, setAssets] = useState<SessionAsset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<SessionAsset | null>(null);
  const [securityOverlay, setSecurityOverlay] = useState(false);
  
  const [objectives, setObjectives] = useState<StrategicObjective[]>([
    { id: 'obj-1', label: 'Network Integrity', progress: 100, status: 'ACTIVE' },
    { id: 'obj-2', label: 'Campaign Synthesis', progress: 0, status: 'PENDING' },
    { id: 'obj-3', label: 'Forensic Validation', progress: 0, status: 'PENDING' },
  ]);
  const [config, setConfig] = useState<DeploymentConfig>({
    thinkingBudget: 32768, 
    maxTokens: 4000,
    nodeId: 'SN-00',
    imageSize: '1K',
    aspectRatio: '16:9'
  });

  // Transcription Buffers
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  // Telemetry Simulation
  useEffect(() => {
    if (!showConsole) return;
    const interval = setInterval(() => {
      setConfidence(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Math.min(99.99, Math.max(98.5, prev + delta));
      });
      setEntropy(prev => {
        const delta = (Math.random() - 0.5) * 0.05;
        return Math.min(2.5, Math.max(0.5, prev + delta));
      });
      setNodes(prev => prev.map(n => {
        if (n.status === NodeStatus.PROCESSING) return n;
        const newLoad = Math.max(2, Math.min(45, n.load + (Math.random() - 0.5) * 5));
        return { ...n, load: Math.floor(newLoad) };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [showConsole]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const logToTrace = useCallback((sender: TraceEntry['sender'], content: string, type: TraceEntry['type'] = 'text', metadata?: any) => {
    setTraceEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sender, content, type, metadata
    }]);
  }, []);

  const decodeAudioChunk = async (base64: string, ctx: AudioContext) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const stopLiveSession = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.then((session: any) => session.close());
      liveSessionRef.current = null;
    }
    audioSourcesRef.current.forEach(s => s.stop());
    audioSourcesRef.current.clear();
    setIsLive(false);
    logToTrace('SYSTEM', 'LIVE_BRIDGE_TERMINATED: Sovereign voice uplink severed.');
  };

  const startLiveSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      logToTrace('SYSTEM', 'LIVE_BRIDGE_INITIATING: Establishing Sovereign voice uplink...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(session => session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            // Handle Transcription
            if (m.serverContent?.inputTranscription) {
              currentInputTranscription.current += m.serverContent.inputTranscription.text;
            }
            if (m.serverContent?.outputTranscription) {
              currentOutputTranscription.current += m.serverContent.outputTranscription.text;
            }

            if (m.serverContent?.turnComplete) {
              const userText = currentInputTranscription.current;
              const agentText = currentOutputTranscription.current;
              if (userText) logToTrace('USER', `[Voice] ${userText}`);
              if (agentText) logToTrace('AGENT', agentText, 'text', { nodeId: 'SN-21' });
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
            }

            // Handle Audio
            const ab64 = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (ab64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const b = await decodeAudioChunk(ab64, ctx);
              const s = ctx.createBufferSource();
              s.buffer = b; s.connect(ctx.destination); s.start(nextStartTimeRef.current);
              nextStartTimeRef.current += b.duration;
              audioSourcesRef.current.add(s);
              s.onended = () => audioSourcesRef.current.delete(s);
            }
          },
          onclose: () => setIsLive(false),
          onerror: (e) => {
             console.error("Live Bridge Fault:", e);
             stopLiveSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are the G5 Sovereign interface. Speak with industrial authority. English only."
        }
      });
      liveSessionRef.current = sessionPromise;
    } catch (e) { 
      console.error("Failed to establish live bridge:", e);
      setIsLive(false); 
    }
  };

  const handleExecute = async (command: string, files?: FileData[]) => {
    logToTrace('USER', command);
    setIsThinking(true);
    setEntropy(prev => Math.min(5, prev + 1.2));
    
    setNodes(prev => prev.map(n => n.id === activeNodeId ? { ...n, status: NodeStatus.PROCESSING, load: 98 } : n));
    
    try {
      const output = await executeNodeAction(command, { ...config, nodeId: activeNodeId }, files);
      
      setConfidence(prev => Math.min(99.9, prev + 0.1));
      setEntropy(prev => Math.max(0.8, prev - 0.3));

      if (output.artifacts && output.artifacts.length > 0) {
        const newAssets: SessionAsset[] = output.artifacts.map(a => ({
          id: Math.random().toString(36).substr(2, 9),
          type: a.type === 'image' ? 'IMAGE' : a.type === 'video' ? 'VIDEO' : a.type === 'audio' ? 'AUDIO' : 'DOC',
          url: a.content,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          nodeId: activeNodeId,
          label: command.length > 25 ? command.substring(0, 25) + '...' : command
        }));
        setAssets(prev => [...newAssets, ...prev]);
        setObjectives(prev => prev.map(o => o.id === 'obj-2' ? { ...o, progress: Math.min(100, o.progress + 20), status: 'ACTIVE' } : o));
      }

      if (output.grounding) {
        setObjectives(prev => prev.map(o => o.id === 'obj-3' ? { ...o, progress: Math.min(100, o.progress + 25), status: 'ACTIVE' } : o));
      }

      logToTrace('AGENT', output.data, 'text', { 
        nodeId: activeNodeId, 
        artifacts: output.artifacts,
        grounding: output.grounding,
        imageUrl: output.artifacts?.find(a => a.type === 'image')?.content,
        videoUrl: output.artifacts?.find(a => a.type === 'video')?.content
      });
      
    } catch (e: any) {
      if (e.message?.includes('Requested entity was not found')) {
        logToTrace('SYSTEM', 'CRITICAL_AUTH_EXPIRED: API Key validation failed. Re-authorization required.');
        (window as any).aistudio.openSelectKey();
      } else {
        logToTrace('SYSTEM', `CRITICAL_FAULT: ${e.message || 'Logical path corruption.'}`);
      }
      setEntropy(prev => Math.min(10, prev + 3));
    } finally {
      setIsThinking(false);
      setNodes(prev => prev.map(n => ({ ...n, status: NodeStatus.ONLINE, load: 5 + Math.floor(Math.random() * 8) })));
    }
  };

  if (!showConsole) return <LandingPage onEnter={() => setShowConsole(true)} />;

  return (
    <div className="flex flex-col h-screen bg-obsidian text-chrome font-sans selection:bg-neon overflow-hidden">
      {securityOverlay && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden opacity-30 select-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,240,255,0.1),rgba(0,0,0,0),rgba(0,240,255,0.1))] bg-[length:100%_4px,10%_100%] animate-pulse"></div>
          <div className="absolute top-20 left-10 text-[8px] font-mono text-neon border border-neon p-2 bg-void/80 uppercase">Tunnel_Link_01: Secure</div>
        </div>
      )}

      <header className="h-12 border-b border-steel bg-void flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowConsole(false)}>
            <div className="w-5 h-5 bg-neon flex items-center justify-center shadow-[0_0_12px_#00f0ff]">
              <span className="text-void font-black text-xl">G5</span>
            </div>
            <h1 className="text-xs font-bold tracking-[0.4em] uppercase">AGENTICUM G5 OS</h1>
          </div>
          <div className="h-4 w-px bg-steel" />
          <div className="flex gap-4 items-center">
            {objectives.map(obj => (
              <div key={obj.id} className="hidden lg:flex items-center gap-2 px-3 border-r border-steel/30 last:border-0">
                <span className="text-[7px] text-tungsten font-black uppercase tracking-widest">{obj.label}</span>
                <div className="w-12 h-1 bg-steel/50 rounded-none overflow-hidden">
                   <div className="h-full bg-neon transition-all duration-1000 shadow-[0_0_5px_#00f0ff]" style={{ width: `${obj.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center border border-steel h-7 overflow-hidden">
            <button 
              onClick={() => setViewMode('GRID')}
              className={`px-3 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${viewMode === 'GRID' ? 'bg-neon text-void' : 'text-tungsten hover:text-chrome'}`}
            >Grid</button>
            <button 
              onClick={() => setViewMode('MESH')}
              className={`px-3 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${viewMode === 'MESH' ? 'bg-neon text-void' : 'text-tungsten hover:text-chrome'}`}
            >Mesh</button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-[9px] text-tungsten uppercase font-bold tracking-widest hidden md:block">Depth_Alloc</label>
            <input 
              type="range" min="0" max="32768" step="4096"
              value={config.thinkingBudget}
              onChange={(e) => setConfig(prev => ({ ...prev, thinkingBudget: parseInt(e.target.value) }))}
              className="w-24 h-1 bg-steel appearance-none cursor-pointer accent-neon"
            />
          </div>
          <button 
            onClick={() => setSecurityOverlay(!securityOverlay)}
            className={`transition-all duration-300 ${securityOverlay ? 'text-neon drop-shadow-[0_0_10px_#00f0ff]' : 'text-tungsten hover:text-chrome'}`}
            title="Toggle Protocol Visualization"
          >
            <ICONS.Shield />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'GRID' ? (
          <NodeGrid nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
        ) : (
          <div className="w-72 shrink-0 border-r border-steel">
            <TopologyView nodes={nodes} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
          </div>
        )}
        
        <main className="flex-1 flex flex-col bg-obsidian relative">
          <SovereignHUD confidence={confidence} entropy={entropy} activeNodes={nodes.filter(n => n.status !== NodeStatus.OFFLINE).length} />
          
          <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,240,255,0.06),rgba(0,0,0,0.02),rgba(0,240,255,0.06))] bg-[length:100%_4px,4px_100%] pointer-events-none"></div>
          
          <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
            <ReasoningTrace entries={traceEntries} isThinking={isThinking} />
            <CommandLine onExecute={handleExecute} onToggleLive={isLive ? stopLiveSession : startLiveSession} isLive={isLive} disabled={isThinking} />
          </div>
        </main>

        <AssetRepository assets={assets} onPreview={(a) => setPreviewAsset(a)} />
      </div>

      <AssetPreviewModal asset={previewAsset} onClose={() => setPreviewAsset(null)} />
    </div>
  );
};

export default App;
