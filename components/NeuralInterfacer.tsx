
import React, { useEffect, useRef } from 'react';

interface NeuralInterfacerProps {
  isThinking: boolean;
  entropy: number;
  showVision?: boolean;
  stream?: MediaStream | null;
}

const NeuralInterfacer: React.FC<NeuralInterfacerProps> = ({ isThinking, entropy, showVision, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (showVision && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [showVision, stream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!showVision) {
        // Standard Particles if no Vision
        // (Particle logic for ambient mode)
      } else {
        // Vision HUD Overlays
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.3)';
        ctx.lineWidth = 1;
        
        // Fadenkreuz
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy); ctx.lineTo(cx + 50, cy);
        ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy + 50);
        ctx.stroke();
        
        // Ecken-HUD
        const pad = 100;
        ctx.strokeRect(pad, pad, 40, 40); // Top Left
        ctx.strokeRect(canvas.width - pad - 40, pad, 40, 40); // Top Right
        ctx.strokeRect(pad, canvas.height - pad - 40, 40, 40); // Bottom Left
        ctx.strokeRect(canvas.width - pad - 40, canvas.height - pad - 40, 40, 40); // Bottom Right
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isThinking, entropy, showVision]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {showVision && (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover opacity-20 grayscale brightness-50"
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40 transition-opacity duration-1000" />
    </div>
  );
};

export default NeuralInterfacer;
