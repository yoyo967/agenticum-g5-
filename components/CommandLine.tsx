import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';

interface CommandLineProps {
  onExecute: (cmd: string, files?: { data: string, mimeType: string }[]) => void;
  onToggleLive: () => void;
  isLive: boolean;
  disabled: boolean;
}

const CommandLine: React.FC<CommandLineProps> = ({ onExecute, onToggleLive, isLive, disabled }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<{ data: string, mimeType: string, name?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onExecute(input.trim(), files.length > 0 ? files : undefined);
      setInput('');
      setFiles([]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: { data: string, mimeType: string, name: string }[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      newFiles.push({ data: base64, mimeType: file.type, name: file.name });
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className="p-4 border-t border-steel bg-void/80 backdrop-blur-xl relative z-20">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-steel/50 to-transparent"></div>
      
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((f, i) => (
            <div key={i} className="group text-[8px] text-neon font-mono px-2 py-1 bg-neon/5 border border-neon/20 flex items-center gap-3 hover:border-neon/50 transition-all">
              <div className="flex flex-col">
                <span className="opacity-60 uppercase font-black text-[7px] tracking-tighter">Buffer_{i.toString().padStart(2, '0')}</span>
                <span className="truncate max-w-[120px]">{f.name || f.mimeType.split('/')[1].toUpperCase()}</span>
              </div>
              <button 
                onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} 
                className="text-tungsten hover:text-error transition-colors p-0.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 items-stretch">
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-tungsten hover:text-neon transition-all duration-150 transform hover:scale-110 active:scale-90"
              title="Attach Protocol Assets"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            <div className="w-px h-4 bg-steel/50 hidden md:block" />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            multiple 
          />
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled || isLive}
            placeholder={isLive ? "LIVE_BRIDGE_ACTIVE: STANDBY FOR INPUT..." : disabled ? "NODE_COMPUTING: BUFFERING COMMAND..." : ">> DEPLOY_SEQUENCE_PARAMETER"}
            className="w-full bg-obsidian border border-steel group-hover:border-steel/80 focus:border-neon focus:ring-1 focus:ring-neon/20 focus:outline-none py-3.5 pl-14 pr-4 text-chrome font-mono text-xs transition-all placeholder:text-tungsten tracking-wider uppercase"
          />
        </div>
        
        <div className="flex gap-2">
            <button
              type="button"
              onClick={onToggleLive}
              className={`px-4 border transition-all flex items-center gap-2 ${
                isLive 
                ? 'border-active bg-active/5 text-active shadow-[0_0_15px_rgba(0,255,136,0.2)]' 
                : 'border-steel bg-void text-tungsten hover:text-active hover:border-active/50'
              }`}
              title="Activate High-Fidelity Voice Interface"
            >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isLive ? 'animate-pulse' : ''}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
               <span className="hidden lg:inline text-[9px] font-black uppercase tracking-widest">{isLive ? 'LIVE' : 'VOICE'}</span>
            </button>

            <button 
                type="submit" 
                disabled={disabled || !input.trim() || isLive}
                className={`text-[10px] font-black uppercase tracking-[0.2em] px-8 border transition-all relative overflow-hidden group/btn ${
                    disabled || !input.trim() || isLive
                    ? 'border-steel text-tungsten cursor-not-allowed bg-void' 
                    : 'border-neon text-neon hover:bg-neon hover:text-void cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                }`}
            >
                <div className="relative z-10 flex items-center gap-2">
                  <span className="hidden sm:inline">Execute</span>
                  <ICONS.ChevronRight />
                </div>
            </button>
        </div>
      </form>
      <div className="mt-2 flex justify-between px-1">
        <div className="flex gap-4">
           <span className="text-[7px] text-tungsten/50 uppercase font-mono">Input_Buffer: {input.length} chrs</span>
           <span className="text-[7px] text-tungsten/50 uppercase font-mono">Encryption: AES-256</span>
        </div>
        <div className="flex gap-4">
           <span className="text-[7px] text-tungsten/50 uppercase font-mono underline decoration-neon/20 hover:text-neon cursor-pointer">Protocol_Docs</span>
           <span className="text-[7px] text-tungsten/50 uppercase font-mono underline decoration-active/20 hover:text-active cursor-pointer">Diagnostics</span>
        </div>
      </div>
    </div>
  );
};

export default CommandLine;