
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

const COMMAND_SUGGESTIONS = [
  { label: 'DEEP_SCAN', cmd: 'Perform a comprehensive competitive analysis' },
  { label: 'VISUAL_FORGE', cmd: 'Create a high-end industrial key visual' },
  { label: 'CINEMA_RENDER', cmd: 'Generate an autonomous 4K cinematic trailer' },
  { label: 'SOVEREIGN_AUDIT', cmd: 'Audit my current strategy for compliance' }
];

const CommandLine: React.FC<CommandLineProps> = ({ onExecute, onToggleLive, onOpenDiagnostics, isLive, isVision, disabled }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onExecute(input.trim(), selectedFiles.length > 0 ? selectedFiles : undefined);
      setHistory(prev => [input.trim(), ...prev.slice(0, 49)]);
      setInput('');
      setHistoryIndex(-1);
      setSelectedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < history.length) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
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
      className={`p-8 bg-obsidian border-t border-steel font-mono relative z-30 transition-all duration-700 shrink-0 ${isHovered ? 'shadow-[0_-40px_100px_rgba(0,240,255,0.1)]' : 'shadow-[0_-20px_60px_rgba(0,0,0,0.8)]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Quick Action Suggestions */}
        {!input && !disabled && !isLive && (
          <div className="flex gap-4 mb-1 animate-in fade-in slide-in-from-left duration-500">
            {COMMAND_SUGGESTIONS.map((s) => (
              <button 
                key={s.label}
                onClick={() => setInput(s.cmd)}
                className="px-5 py-2 border border-steel/30 text-[9px] text-tungsten font-black uppercase tracking-[0.4em] hover:border-neon hover:text-neon transition-all bg-void/50 hover:bg-neon/5"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="flex gap-4 mb-1 animate-in slide-in-from-bottom-4 duration-500">
            {selectedFiles.map((f, i) => (
              <div key={i} className="px-5 py-2.5 bg-neon/10 border border-neon/40 text-[10px] text-neon font-black flex items-center gap-4">
                 <div className="w-2 h-2 bg-neon shadow-[0_0_10px_#00f0ff] animate-pulse" />
                 <span className="uppercase tracking-[0.2em] truncate max-w-[200px]">{f.name}</span>
                 <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-white transition-colors p-1 ml-2 text-lg leading-none">&times;</button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-6 items-stretch h-16">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-8 border-2 border-steel text-tungsten hover:border-neon hover:text-neon transition-all flex items-center justify-center bg-steel/5 active:scale-95"
            title="Attach Context Asset"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
          </button>

          <div className="relative flex-1 bg-void border-2 border-steel hover:border-neon/50 transition-all group shadow-inner flex items-center">
            <div className="pl-8 text-neon opacity-40 group-hover:opacity-100 transition-opacity">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <input
              type="text"
              value={input}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled || isLive}
              placeholder={isLive ? "NEURAL_UPLINK_LISTENING..." : "TRANSMIT_SOVEREIGN_DIRECTIVE..."}
              className="w-full h-full bg-transparent px-6 text-[15px] text-chrome focus:outline-none tracking-[0.2em] font-black placeholder:opacity-20 uppercase"
            />
            {disabled && (
              <div className="absolute right-6 flex items-center gap-3">
                 <span className="text-[10px] text-neon font-black uppercase tracking-widest animate-pulse">Processing_Swarm</span>
                 <div className="w-1.5 h-6 bg-neon animate-pulse" />
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={disabled || !input.trim() || isLive}
            className="px-20 bg-neon text-void text-[13px] font-black uppercase tracking-[0.8em] hover:bg-white hover:shadow-[0_0_100px_rgba(0,240,255,0.6)] transition-all disabled:opacity-5 active:scale-95 relative overflow-hidden group shadow-2xl"
          >
            <span className="relative z-10">FORGE</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>
        
        <div className="flex justify-between items-center text-[9px] font-black text-tungsten tracking-[0.4em] uppercase opacity-30 px-2">
           <span>Sub_Neural_Terminal: G5_SECURE_MODE</span>
           <span>Session_Architect: Y.Yildirim</span>
           <span>Repo: yoyo967/agenticum-g5-</span>
        </div>
      </div>
    </div>
  );
};

export default CommandLine;
