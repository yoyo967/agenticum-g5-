
import React, { useEffect, useState } from 'react';

const LOG_TEMPLATES = [
  "NODE_HANDSHAKE: [ID] verified via GATES",
  "SYNTHESIS_CHUNK: [HEX] allocated to memory",
  "UPLINK_STABLE: Latency [MS]ms",
  "ENTROPY_FLUX: Delta [DELTA] detected",
  "SOVEREIGN_SIG: Authenticating thought signature...",
  "PARALLEL_SYNC: Nodes in cluster [CLUSTER] active",
];

const TelemetryTicker: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const log = template
        .replace('[ID]', `RA-${Math.floor(Math.random() * 99)}`)
        .replace('[HEX]', `0x${Math.random().toString(16).slice(2, 6).toUpperCase()}`)
        .replace('[MS]', (Math.random() * 20 + 5).toFixed(2))
        .replace('[DELTA]', (Math.random() * 0.005).toFixed(4))
        .replace('[CLUSTER]', ['STRATEGY', 'CREATION', 'INTELLIGENCE'][Math.floor(Math.random() * 3)]);
      
      setLogs(prev => [log, ...prev.slice(0, 10)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-7 bg-black border-t border-steel/40 flex items-center px-6 overflow-hidden select-none z-50 relative shrink-0">
      <div className="flex items-center gap-12 animate-[marquee_60s_linear_infinite] whitespace-nowrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-12">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-1 h-1 bg-neon rounded-full" />
                <span className="text-[8px] font-mono font-black text-tungsten tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
                  {log}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default TelemetryTicker;
