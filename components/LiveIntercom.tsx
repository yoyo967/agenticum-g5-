
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface LiveIntercomProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveIntercom: React.FC<LiveIntercomProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setErrorMessage] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const visionIntervalRef = useRef<number | null>(null);

  // PCM Decoding Utils
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const encodePCM = (data: Float32Array): Blob => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
  };

  const startSession = async () => {
    setErrorMessage(null);
    try {
      let stream: MediaStream;
      let hasVideo = true;

      try {
        // Attempt to get both audio and video
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch (e) {
        console.warn("Primary media request failed, attempting audio-only fallback.", e);
        try {
          // Fallback to audio only if camera is missing or denied
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          hasVideo = false;
        } catch (audioErr) {
          setErrorMessage("CRITICAL: No microphone detected. Neural uplink impossible.");
          return;
        }
      }

      if (hasVideo && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(s => s.sendRealtimeInput({ media: encodePCM(inputData) }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);

            // Vision Streaming (1 Frame per second) - Only if video is available
            if (hasVideo) {
              visionIntervalRef.current = window.setInterval(() => {
                if (!canvasRef.current || !videoRef.current) return;
                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;
                
                // Draw current frame to canvas
                ctx.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob(async (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.5);
              }, 1000);
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const audioBytes = decodeBase64(msg.serverContent.modelTurn.parts[0].inlineData.data);
              const audioBuffer = await decodeAudioData(audioBytes, outputCtx);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + " " + msg.serverContent?.outputTranscription?.text).slice(-500));
            }
          },
          onerror: (err) => {
            setErrorMessage("Neural session encountered an error.");
            console.error(err);
          },
          onclose: () => {
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are the AGENTICUM G5 Neural Presence. You act as the immediate voice interface of a 52-node autonomous agency. Be authoritative, brief, and highly intelligent. If you see through the camera, mention your observations.'
        }
      });

      sessionPromiseRef.current = sessionPromise;
      setIsActive(true);
    } catch (e: any) {
      setErrorMessage(`Session failed: ${e.message || 'Hardware conflict'}`);
      console.error("Session failed", e);
    }
  };

  const stopSession = () => {
    if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
    sessionPromiseRef.current?.then((s: any) => s.close());
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsActive(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-8 bg-void/95 backdrop-blur-3xl font-mono">
      <div className="relative w-full max-w-4xl bg-obsidian border border-warning/30 p-12 shadow-[0_0_150px_rgba(255,170,0,0.1)] flex flex-col items-center gap-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-warning/50 animate-pulse" />
        
        {error && (
          <div className="w-full p-4 bg-error/20 border border-error text-error text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 w-full h-64">
          <div className="relative bg-black border border-steel/30 overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-50" />
            <canvas ref={canvasRef} width={320} height={240} className="hidden" />
            <div className="absolute top-4 left-4 text-[8px] text-warning font-black tracking-widest uppercase bg-void/80 px-2 py-1">Vision_Uplink</div>
            {!videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center text-[8px] text-steel uppercase font-black">No_Video_Feed</div>
            )}
          </div>
          <div className="bg-void/50 border border-steel/30 p-6 overflow-y-auto">
             <div className="flex gap-2 mb-4">
                <div className={`w-2 h-2 ${isActive ? 'bg-warning animate-ping' : 'bg-steel'} shadow-[0_0_10px_currentColor]`} />
                <span className="text-[10px] text-warning font-black uppercase tracking-widest">Realtime_Transcription</span>
             </div>
             <p className="text-[11px] text-chrome/60 leading-relaxed uppercase tracking-widest italic">
               {transcription || (isActive ? "Awaiting neural sync..." : "Uplink offline.")}
             </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${isActive ? 'border-warning shadow-[0_0_60px_#ffaa00]' : 'border-steel'}`}>
              <div className={`w-12 h-12 flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isActive ? 'text-warning' : 'text-steel'}>
                   <path d="M12 1v10M12 23v-4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                 </svg>
              </div>
           </div>
           <h2 className="text-sm font-black text-warning tracking-[0.5em] uppercase">NEURAL_PRESENCE_v7.0</h2>
        </div>

        <div className="flex gap-4 w-full">
           <button 
             onClick={isActive ? stopSession : startSession}
             className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.5em] transition-all ${isActive ? 'bg-error text-void' : 'bg-warning text-void shadow-[0_0_30px_rgba(255,170,0,0.3)] hover:bg-white hover:shadow-[0_0_50px_#ffaa00]'}`}
           >
             {isActive ? 'DISCONNECT' : 'INITIATE_SYNC'}
           </button>
           <button onClick={onClose} className="px-8 py-4 border border-steel text-tungsten font-black text-[10px] uppercase tracking-widest hover:text-chrome">TERMINATE</button>
        </div>
      </div>
    </div>
  );
};

export default LiveIntercom;
