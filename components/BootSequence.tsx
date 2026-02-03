
import React, { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('INITIALIZING_CORE_CNS');
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = [
    '0x00A1: KERNEL_UPLINK_STABLE',
    '0x00C2: MEMORY_MAPPING_1024GB',
    '0x00D4: DECRYPTING_SOVEREIGN_VAULT',
    '0x00E9: MESH_TOPOLOGY_CALIBRATED',
    '0x011A: GATES_PROTOCOL_LOADED',
    '0x012B: ELITE_OCTET_RESERVED',
    '0x014C: VEO_3.1_DRIVER_ACTIVE',
    '0x016D: IMAGEN_3_PRO_WARMUP',
    '0x019E: SYNCING_GLOBAL_CONSENSUS',
    '0x020F: OS_G5_READY'
  ];

  useEffect(() => {
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 2.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        
        // Update messages and logs
        if (next > (currentLogIndex + 1) * 10) {
          setMessage(bootLogs[currentLogIndex].split(': ')[1]);
          setLogs(prev => [...prev, bootLogs[currentLogIndex]]);
          currentLogIndex++;
        }
        
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-void flex flex-col items-center justify-center font-mono p-12 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_0%,transparent_100%)]" />
      
      <div className="relative w-full max-w-xl space-y-12">
        <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 bg-neon flex items-center justify-center shadow-[0_0_50px_#00f0ff] relative group">
            <span className="text-void font-black text-4xl">G5</span>
            <div className="absolute inset-0 border-2 border-neon animate-ping opacity-20" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-chrome font-black text-2xl tracking-[1em] uppercase leading-none pl-4">Agenticum_G5</h1>
            <span className="text-[10px] text-tungsten font-black uppercase tracking-[0.5em] opacity-40">Sovereign_OS_Kernel_v5.0.2</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-[11px] text-neon font-black tracking-widest uppercase animate-pulse">{message}</span>
            <span className="text-[14px] text-chrome font-black">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-[2px] bg-steel w-full relative overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 left-0 bg-neon shadow-[0_0_15px_#00f0ff] transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="h-32 overflow-hidden relative border-l border-steel/20 pl-6">
          <div className="flex flex-col gap-2">
            {logs.map((log, i) => (
              <div key={i} className="text-[10px] text-tungsten font-black tracking-widest uppercase opacity-40 animate-in slide-in-from-left duration-300">
                {log} <span className="text-active ml-2">DONE</span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-void to-transparent" />
        </div>
      </div>

      <div className="absolute bottom-12 left-12 opacity-20">
         <div className="text-[9px] text-tungsten font-black uppercase tracking-[0.6em] space-y-1">
            <div>HW_UID: 0x7F2B-CNS-G5</div>
            <div>MESH_ENTROPY: 0.0421</div>
            <div>CRYPTO_FINALITY: 1.0</div>
         </div>
      </div>
    </div>
  );
};

export default BootSequence;
