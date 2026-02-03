
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

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (showVision) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const time = t / 1000;

        // Dynamic Targeting HUD
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.2);
        
        // Circular brackets
        for(let i=0; i<4; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, 150, i * Math.PI/2 + 0.2, (i+1) * Math.PI/2 - 0.2);
          ctx.stroke();
        }
        ctx.restore();

        // Corner Scanners
        const scanY = (time * 200) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.stroke();

        // Military HUD Text
        ctx.fillStyle = '#00f0ff';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`LATENCY: ${(Math.random() * 20 + 10).toFixed(2)}ms`, 50, 50);
        ctx.fillText(`FRAME_SYNC: OK`, 50, 70);
        ctx.fillText(`ENTROPY_FLUX: ${entropy.toFixed(4)}`, 50, 90);
      } else if (isThinking) {
        // Subtle Pulse
        const alpha = 0.05 + Math.sin(t / 200) * 0.02;
        ctx.fillStyle = `rgba(170, 0, 255, ${alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

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
          className="w-full h-full object-cover opacity-30 grayscale sepia brightness-75 contrast-125"
          style={{ filter: 'hue-rotate(150deg) saturate(2)' }}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-60" />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isThinking ? 'opacity-20' : 'opacity-0'} bg-[radial-gradient(circle_at_center,_#aa00ff44_0%,transparent_70%)]`} />
    </div>
  );
};

export default NeuralInterfacer;
