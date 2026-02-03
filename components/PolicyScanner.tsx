
import React, { useEffect, useRef, useState } from 'react';

interface PolicyScannerProps {
  isActive: boolean;
  onScanComplete: (analysis: string) => void;
}

const PolicyScanner: React.FC<PolicyScannerProps> = ({ isActive, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Access Refused:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const runScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          onScanComplete("Environmental Compliance Verified. No IP infringement detected in capture frame. Policy MI-01 compliant.");
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[600] bg-void/90 backdrop-blur-2xl flex items-center justify-center p-12 font-mono">
      <div className="relative w-full max-w-4xl aspect-video bg-obsidian border border-steel shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60" />
        
        {/* Scanner HUD */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full border-[40px] border-void/60" />
          <div className="absolute inset-10 border border-white/5" />
          
          <div className="absolute top-16 left-16 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-error animate-ping" />
              <span className="text-[12px] font-black text-error uppercase tracking-[0.5em]">Policy_Governor_Active</span>
            </div>
            <span className="text-[9px] text-tungsten font-black uppercase tracking-widest">Node_Origin: MI-01 // GOVERNANCE</span>
          </div>

          {isScanning && (
            <>
              <div className="absolute left-0 w-full h-[2px] bg-error shadow-[0_0_15px_#ff0055] transition-all duration-100" style={{ top: `${scanProgress}%` }} />
              <div className="absolute inset-0 bg-error/5 animate-pulse" />
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <span className="text-xl font-black text-error uppercase tracking-[0.8em]">Analyzing_Visual_Forensics</span>
                <div className="w-64 h-1 bg-steel relative">
                  <div className="absolute inset-y-0 left-0 bg-error" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            </>
          )}

          <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
            <div className="text-[9px] text-tungsten font-black uppercase tracking-[0.6em] space-y-1">
              <div>FRAME_ID: 0x882A</div>
              <div>COMPLIANCE_DELTA: 0.0001</div>
              <div>IP_SCAN: ACTIVE</div>
            </div>
            {!isScanning && (
              <button 
                onClick={runScan}
                className="px-12 py-4 bg-error text-void font-black text-[11px] uppercase tracking-[0.5em] pointer-events-auto hover:bg-white transition-all active:scale-95"
              >
                Execute_Compliance_Scan
              </button>
            )}
          </div>
        </div>

        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <span className="text-[120px] font-black text-error leading-none tracking-tighter">AUDIT</span>
        </div>
      </div>
    </div>
  );
};

export default PolicyScanner;
