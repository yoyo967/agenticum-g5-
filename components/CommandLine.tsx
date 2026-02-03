
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { FileData } from '../types';

interface CommandLineProps {
  onExecute: (cmd: string, files?: FileData[]) => void;
  onToggleLive: (useVision: boolean) => void;
  onOpenDiagnostics: () => void;
  isLive: boolean;
  isVision: boolean;
  disabled: boolean;
}

const CommandLine: React.FC<CommandLineProps> = ({ onExecute, onToggleLive, onOpenDiagnostics, isLive, isVision, disabled }) => {
  const [input, setInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onExecute(input.trim(), selectedFiles.length > 0 ? selectedFiles : undefined);
      setInput('');
      setSelectedFiles([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setSelectedFiles(prev => [...prev, {
              data: event.target!.result!.toString().split(',')[1],
              mimeType: file.type,
              name: file.name
            }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div 
      className={`p-6 bg-obsidian border-t border-steel font-mono relative z-30 transition-all duration-700 shrink-0 ${isHovered ? 'shadow-[0_-30px_80px_rgba(0,240,255,0.15)]' : 'shadow-[0_-15px_40px_rgba(0,0,0,0.8)]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {selectedFiles.length > 0 && (
          <div className="flex gap-4 mb-2 animate-in slide-in-from-bottom-4 duration-500">
            {selectedFiles.map((f, i) => (
              <div key={i} className="px-4 py-2 bg-neon/10 border border-neon/40 text-[10px] text-neon font-black flex items-center gap-3">
                 <span className="uppercase tracking-widest">{f.name}</span>
                 <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-white transition-colors">×</button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-4 items-stretch h-14">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 border border-steel text-tungsten hover:border-chrome hover:text-chrome transition-all flex items-center justify-center bg-steel/5"
            title="Upload Asset"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
          </button>

          <div className="relative flex-1 bg-void border border-steel hover:border-neon/40 transition-all group shadow-inner flex items-center">
            <div className="pl-6 text-neon opacity-40 group-hover:opacity-100 transition-opacity">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled || isLive}
              placeholder={isLive ? "SYTEM_LISTENING..." : "TRANSMIT_SOVEREIGN_COMMAND..."}
              className="w-full h-full bg-transparent px-4 text-[14px] text-chrome focus:outline-none tracking-widest font-bold placeholder:opacity-20 uppercase"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onToggleLive(false)}
              className={`px-6 border flex items-center gap-3 transition-all duration-300 ${isLive && !isVision ? 'border-thinking text-thinking bg-thinking/10 shadow-[0_0_20px_rgba(170,0,255,0.2)]' : 'border-steel text-tungsten hover:border-thinking hover:text-thinking bg-steel/5'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive && !isVision ? 'bg-thinking animate-pulse' : 'bg-steel/40'}`} />
              <span className="text-[11px] font-black tracking-widest uppercase">AUDIO</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleLive(true)}
              className={`px-6 border flex items-center gap-3 transition-all duration-300 ${isLive && isVision ? 'border-error text-error bg-error/10 shadow-[0_0_20px_rgba(255,0,85,0.2)]' : 'border-steel text-tungsten hover:border-error hover:text-error bg-steel/5'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive && isVision ? 'bg-error animate-pulse' : 'bg-steel/40'}`} />
              <span className="text-[11px] font-black tracking-widest uppercase">VISION</span>
            </button>
          </div>

          <button 
            type="submit"
            disabled={disabled || !input.trim() || isLive}
            className="px-14 bg-neon text-void text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:shadow-[0_0_50px_#00f0ff] transition-all disabled:opacity-10 active:scale-95 relative overflow-hidden group shadow-2xl"
          >
            <span className="relative z-10">FORGE</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommandLine;
