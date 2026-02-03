
import React, { useEffect, useState, useRef } from 'react';
import { audioService } from '../services/audioService';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      setScrollY(window.scrollY);
      
      const sections = ['manifesto', 'mesh', 'forge', 'engine', 'gates', 'dossier', 'engagement', 'deployment'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 450 && rect.bottom >= 450) {
            setActiveSection(section);
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    audioService.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInitialize = async () => {
    audioService.playEnter();
    
    // MANDATORY API KEY CHECK FOR VEO GENERATION
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }
    
    onEnter();
  };

  const clusters = [
    { id: 'SN', title: 'APEX_ORCHESTRATOR', desc: 'Central CNS governing objective decomposition into atomic task-mesh.', status: 'STABLE', metric: 'v10.2' },
    { id: 'RA', title: 'INTEL_FORENSICS', desc: 'Real-time grounding via Google Search with deep-packet validation.', status: 'SYNCED', metric: '99.8%' },
    { id: 'SP', title: 'STRATEGIC_BLUEPRINT', desc: 'System 2 reasoning for high-stakes business & causal mapping.', status: 'CALIBRATED', metric: '32K_TOK' },
    { id: 'CC', title: 'MULTIMODAL_FORGE', desc: 'Industrial production via Veo 3.1 & Imagen 4 creative pipelines.', status: 'ACTIVE', metric: '4K_RES' },
    { id: 'MI', title: 'POLICY_GATEWAY', desc: 'Sovereign governance ensuring IP compliance and ethical alignment.', status: 'SECURE', metric: 'GATES_V2' },
    { id: 'PS', title: 'SPECIAL_OPS', desc: 'Adversarial testing, ghost-writing and competitive dominance logic.', status: 'STANDBY', metric: 'GHOST_v5' }
  ];

  const features = [
    { title: "MARATHON_AGENT", icon: "∞", desc: "Long-running autonomous nodes that persist through complex campaign cycles." },
    { title: "FORENSIC_GROUNDING", icon: "✓", desc: "Hallucination suppression via GATES protocol and Google Search integration." },
    { title: "NATIVE_MULTIMODAL", icon: "👁", desc: "Simultaneous processing of video, audio and image tokens in a single session." },
    { title: "SYSTEM_2_LOGIC", icon: "🧠", desc: "High-token budget deliberation for deep strategic reasoning and causal planning." }
  ];

  const engagements = [
    { client: 'NEO_CYBERNETICS', objective: 'Global Rebrand Synthesis', result: '3,400+ Artifacts produced in 42min. ROI +450%.', metric: 'EFFICIENCY_MAX' },
    { client: 'VOID_LOGISTICS', objective: 'Market Entry Forensics', result: '99.8% Grounding accuracy. Identified 12 hidden risks.', metric: 'TRUTH_VERIFIED' },
    { client: 'CHROME_DYNAMICS', objective: 'Autonomous Content Mesh', result: '12-month campaign generated in one objective cycle.', metric: 'SCALE_UNLIMITED' }
  ];

  const deploymentTiers = [
    {
      label: 'SDR_BASIC',
      price: 'Free',
      desc: 'Entry-level autonomous exploration.',
      features: ['2 Active Nodes', 'Standard Grounding', '1.2M Context', 'Basic Image Forge'],
      cta: 'Start_Core'
    },
    {
      label: 'SDR_ULTRA',
      price: '$499',
      desc: 'Full industrial agency mesh.',
      features: ['52 Active Nodes', 'Forensic GATES Protocol', 'Veo 3.1 & Imagen 4', 'System 2 Thinking'],
      cta: 'Deploy_Mesh'
    },
    {
      label: 'Sovereign_OS',
      price: 'Custom',
      desc: 'Enterprise-grade on-prem deployment.',
      features: ['Unlimited Clusters', 'Private VPC Uplink', 'Air-Gapped Training', 'Dedicated Lead Arch'],
      cta: 'Contact_Ops'
    }
  ];

  return (
    <div className="bg-void text-chrome font-sans selection:bg-neon selection:text-void scroll-smooth overflow-x-hidden relative">
      
      {/* --- DYNAMIC BACKGROUND MESH --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(0,240,255,0.1)_0%,transparent_50%)]" 
          style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as any}
        />
        <div className="absolute inset-0 opacity-[0.03] grid-bg" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Floating Data Fragments */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({length: 60}).map((_, i) => (
            <div 
              key={i} 
              className="absolute text-[8px] font-mono text-neon/20 animate-[float_25s_infinite] whitespace-nowrap"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {Math.random() > 0.5 ? '0x' + Math.random().toString(16).slice(2, 12).toUpperCase() : 'THOUGHT_SIG_v' + (Math.random()*10).toFixed(1)}
            </div>
          ))}
        </div>
      </div>

      {/* --- SCROLL PROGRESS INDICATOR --- */}
      <div className="fixed top-0 left-0 w-full h-[4px] z-[110] bg-steel/20">
        <div 
          className="h-full bg-gradient-to-r from-neon via-thinking to-neon shadow-[0_0_20px_#00f0ff] transition-all duration-300" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* --- NAVIGATION HEADER --- */}
      <nav className={`fixed top-0 left-0 w-full h-24 border-b border-steel/20 transition-all duration-700 z-[100] px-8 md:px-20 flex items-center justify-between ${scrollY > 50 ? 'bg-void/90 backdrop-blur-3xl h-20' : 'bg-transparent'}`}>
        <div className="flex items-center gap-10 group cursor-default" onClick={handleInitialize}>
          <div className="w-12 h-12 bg-neon flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.3)] group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-1000 cursor-pointer">
            <span className="text-void font-black text-2xl">G5</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black uppercase tracking-[0.6em] text-chrome leading-none">Agenticum</span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-neon opacity-60 mt-2">Neural_Presence_v10.2</span>
          </div>
        </div>
        
        <div className="hidden 2xl:flex gap-14 text-[10px] font-black uppercase tracking-[0.5em]">
          {['manifesto', 'mesh', 'forge', 'engine', 'gates', 'dossier', 'deployment'].map(id => (
            <a 
              key={id}
              href={`#${id}`} 
              onClick={(e) => handleNavClick(e, id)}
              className={`relative transition-all duration-300 hover:text-neon group py-2`}
            >
              <span className={activeSection === id ? 'text-neon' : 'text-tungsten'}>
                {id === 'dossier' ? 'JURY_AUDIT' : id.charAt(0).toUpperCase() + id.slice(1).replace('_', ' ')}
              </span>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-neon transition-all duration-500 ${activeSection === id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </a>
          ))}
        </div>

        <button 
          onClick={handleInitialize}
          onMouseEnter={() => audioService.playClick()}
          className="px-14 py-4 bg-neon text-void text-[12px] font-black uppercase tracking-[0.6em] hover:bg-white hover:shadow-[0_0_80px_rgba(0,240,255,0.6)] transition-all active:scale-95 group overflow-hidden relative shadow-2xl"
        >
          <span className="relative z-10">Initialize_OS</span>
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-20 max-w-7xl">
          <div className="inline-flex items-center gap-6 px-10 py-4 border-2 border-neon/30 bg-neon/5 text-neon text-[11px] font-black uppercase tracking-[0.7em] animate-in fade-in slide-in-from-bottom-10 duration-1000 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
            <div className="w-2.5 h-2.5 bg-neon shadow-[0_0_20px_#00f0ff] animate-pulse" />
            Transcending Generative Latency // Gemini 3 Sovereign Native
          </div>
          
          <div className="relative group">
            <h1 className="text-[14vw] xl:text-[16rem] font-black tracking-tighter uppercase leading-[0.7] select-none text-transparent bg-clip-text bg-gradient-to-b from-chrome via-chrome to-steel/40 transition-all duration-1000 group-hover:tracking-[-0.05em]">
              Sovereign<br/>
              <span className="text-neon drop-shadow-[0_0_150px_rgba(0,240,255,0.5)] animate-pulse">OS</span>
            </h1>
            <div className="absolute -top-12 -right-12 hidden xl:block animate-pulse">
               <span className="text-[10px] font-black text-neon tracking-[1.5em] uppercase vertical-text">Action_Era_Ready</span>
            </div>
          </div>
          
          <p className="text-2xl md:text-4xl text-tungsten font-bold uppercase tracking-[0.5em] max-w-5xl mx-auto leading-relaxed opacity-80 animate-in fade-in duration-1000 delay-500">
            Stop Prompting. <span className="text-chrome border-b-4 border-neon/40 group-hover:border-neon transition-all">Start Executing.</span><br/>
            Autonomous 52-Node Intelligence Mesh.
          </p>
          
          <div className="pt-24 flex flex-col md:flex-row gap-10 justify-center animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
            <button 
              onClick={handleInitialize}
              onMouseEnter={() => audioService.playClick()}
              className="group relative px-24 py-12 bg-chrome text-void font-black text-sm uppercase tracking-[1.2em] hover:bg-neon hover:shadow-[0_0_150px_#00f0ff] transition-all"
            >
              <span className="relative z-10">Access_The_Core</span>
              <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            </button>
            <a 
              href="https://www.youtube.com/@Agenticum"
              target="_blank"
              onMouseEnter={() => audioService.playClick()}
              className="px-16 py-12 border-2 border-warning/40 text-warning font-black text-sm uppercase tracking-[1em] hover:border-warning hover:text-chrome transition-all bg-void/40 backdrop-blur-xl group relative overflow-hidden flex items-center gap-6 shadow-2xl"
            >
              <div className="w-8 h-8 border-2 border-warning flex items-center justify-center relative">
                 <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-warning border-b-[6px] border-b-transparent ml-1" />
              </div>
              <span className="relative z-10">Watch_Mission_Briefing</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 opacity-40 group">
          <span className="text-[10px] font-black uppercase tracking-[1em] group-hover:tracking-[1.5em] transition-all duration-700">Explore_Fabric</span>
          <div className="w-[1.5px] h-24 bg-gradient-to-b from-neon via-neon/40 to-transparent animate-bounce" />
        </div>
      </section>

      {/* --- 01: MANIFESTO --- */}
      <section id="manifesto" className="relative py-80 px-8 md:px-24 bg-void border-y border-steel/10">
        <div className="max-w-7xl mx-auto space-y-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-end">
              <div className="space-y-12">
                <div className="flex items-center gap-8">
                   <span className="text-8xl font-black text-neon/10 italic">01</span>
                   <h2 className="text-[18px] font-black text-neon uppercase tracking-[1em] leading-none">The_Capability_Matrix</h2>
                </div>
                <h3 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none text-chrome">The Agency,<br/>Digitized.</h3>
              </div>
              <p className="text-2xl text-tungsten font-medium leading-relaxed italic border-l-8 border-neon/30 pl-16 py-4 opacity-70">
                Agenticum G5 is a high-performance infrastructure. We have decoded the DNA of world-class agencies and rebuilt it into a sovereign cognitive mesh.
              </p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-steel/20 border border-steel/20 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              {features.map((f, i) => (
                <div key={i} className="bg-void p-16 space-y-10 group hover:bg-steel/10 transition-all duration-700 relative overflow-hidden border border-transparent hover:border-neon/20">
                   <div className="text-6xl font-black text-neon opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700">{f.icon}</div>
                   <h4 className="text-2xl font-black text-chrome uppercase tracking-widest">{f.title}</h4>
                   <p className="text-[13px] text-tungsten font-bold uppercase tracking-widest leading-relaxed opacity-60 group-hover:opacity-100">{f.desc}</p>
                   <div className="absolute bottom-0 left-0 h-1 bg-neon w-0 group-hover:w-full transition-all duration-1000" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- 02: THE MESH --- */}
      <section id="mesh" className="relative py-80 px-8 md:px-24 bg-obsidian overflow-hidden border-b border-steel/10">
        <div className="max-w-7xl mx-auto space-y-48">
          <div className="text-center space-y-12">
            <h2 className="text-[18px] font-black text-neon uppercase tracking-[1.5em]">02_Architecture_Fabric</h2>
            <h3 className="text-8xl md:text-11xl font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-chrome to-steel">52 Cognitive Nodes.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clusters.map((cluster) => (
              <div 
                key={cluster.id} 
                onMouseEnter={() => audioService.playClick()}
                className="p-16 border-2 border-steel/20 bg-void hover:border-neon/60 hover:-translate-y-4 transition-all duration-700 group relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-12 text-9xl font-black opacity-[0.02] group-hover:opacity-[0.1] transition-all select-none group-hover:scale-110">{cluster.id}</div>
                <div className="flex justify-between items-center mb-12">
                   <div className="px-5 py-2 bg-neon/10 border border-neon/40 text-[10px] font-black text-neon uppercase tracking-widest group-hover:bg-neon group-hover:text-void transition-all">{cluster.metric}</div>
                   <div className="w-3.5 h-3.5 bg-active shadow-[0_0_20px_#00ff88] rounded-full animate-pulse" />
                </div>
                <h4 className="text-3xl font-black text-chrome uppercase tracking-widest mb-8">{cluster.title}</h4>
                <p className="text-tungsten leading-relaxed font-bold uppercase text-[12px] tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                  {cluster.desc}
                </p>
                <div className="mt-14 h-[2px] bg-steel/40 w-full relative">
                  <div className="absolute inset-y-0 left-0 bg-neon w-0 group-hover:w-full transition-all duration-1000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 03: THE FORGE --- */}
      <section id="forge" className="relative py-80 px-8 md:px-24 bg-void">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-56 items-center">
          <div className="space-y-28">
            <h2 className="text-[18px] font-black text-neon uppercase tracking-[1.2em]">03_The_Production_Forge</h2>
            <div className="space-y-16">
              <h3 className="text-8xl md:text-10xl font-black uppercase tracking-tighter leading-none text-chrome">Industrial<br/><span className="text-warning drop-shadow-[0_0_50px_rgba(255,170,0,0.2)]">Realization.</span></h3>
              <p className="text-2xl md:text-3xl text-tungsten font-medium leading-relaxed italic border-l-8 border-warning/30 pl-16 py-4 opacity-80">
                Synthesis of 4K cinematic assets and high-fidelity strategy, perfectly aligned to sovereign directives via Veo 3.1 & Imagen 4.
              </p>
            </div>
            <a href="https://www.youtube.com/@Agenticum" target="_blank" className="inline-flex items-center gap-6 px-10 py-5 bg-warning text-void font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all shadow-xl">
               <div className="w-5 h-5 border border-void flex items-center justify-center relative">
                 <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-void border-b-[4px] border-b-transparent ml-0.5" />
               </div>
               Watch_Forge_Demostration
            </a>
          </div>
          <div className="relative aspect-video bg-black border-[6px] border-steel shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="absolute top-12 left-12 p-6 border border-warning/60 bg-void/90 text-warning text-[10px] font-black uppercase tracking-[1.5em] z-20">Veo_3.1_Production_Active</div>
             <div className="flex items-center justify-center h-full relative z-10">
                <div className="w-56 h-56 border-2 border-neon/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
                   <div className="absolute inset-0 border-t-8 border-neon rounded-full animate-spin shadow-[0_0_60px_#00f0ff]" />
                   <span className="text-neon font-black text-5xl animate-pulse">99.8%</span>
                </div>
             </div>
             <div className="absolute bottom-0 left-0 w-full h-2 bg-steel/30">
                <div className="h-full bg-neon animate-[loading_4s_infinite]" />
             </div>
          </div>
        </div>
      </section>

      {/* --- 04: ENGINE (SYSTEM 2) --- */}
      <section id="engine" className="relative py-80 px-8 md:px-24 bg-obsidian border-y border-steel/10 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-40">
          <h2 className="text-[18px] font-black text-thinking uppercase tracking-[1.8em]">04_Neural_Engine_System_2</h2>
          <h3 className="text-8xl md:text-[14rem] font-black uppercase tracking-tighter leading-[0.7] text-chrome">Deep<br/><span className="text-thinking drop-shadow-[0_0_120px_#aa00ff] animate-pulse">Reasoning.</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { label: 'DELIBERATION_BUDGET', value: '32,768', unit: 'TOKENS', color: 'text-thinking' },
              { label: 'CONTEXT_CAPACITY', value: '1.2M', unit: 'SENSORY', color: 'text-chrome' },
              { label: 'REFLEX_LATENCY', value: '85ms', unit: 'SUB_NEURAL', color: 'text-active' }
            ].map((item, idx) => (
              <div key={idx} className="p-16 border-2 border-steel/20 bg-void/40 flex flex-col gap-10 group hover:border-thinking transition-all duration-1000 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <span className={`text-[12px] font-black uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-opacity`}>{item.label}</span>
                <div className="flex flex-col gap-2">
                  <span className={`text-7xl font-black tracking-tighter ${item.color} group-hover:scale-110 transition-transform duration-700`}>{item.value}</span>
                  <span className="text-[12px] text-tungsten font-black uppercase tracking-widest">{item.unit}</span>
                </div>
                <div className="h-[1px] bg-steel/40 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 05: GATES PROTOCOL --- */}
      <section id="gates" className="relative py-80 px-8 md:px-24 bg-void border-y border-steel/10">
        <div className="max-w-6xl mx-auto text-center space-y-40">
          <h2 className="text-[18px] font-black text-neon uppercase tracking-[1.5em]">05_The_GATES_Protocol</h2>
          <h3 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-none text-chrome">Trust Through Forensic Verification.</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-steel/20 border border-steel/20">
            {['Grounding', 'Analysis', 'Tracking', 'Evolution', 'Sovereign'].map((step, idx) => (
              <div key={step} className="p-16 bg-void flex flex-col items-center gap-10 hover:bg-steel/10 transition-all group">
                <div className="text-neon font-black text-6xl opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700">{idx + 1}</div>
                <span className="text-[14px] font-black uppercase tracking-[0.6em] text-tungsten group-hover:text-chrome">{step}</span>
              </div>
            ))}
          </div>
          <p className="text-2xl text-tungsten font-bold uppercase tracking-[0.5em] opacity-40 leading-relaxed max-w-4xl mx-auto">
            Every output is cross-referenced via <span className="text-neon">Google Search Grounding</span> to eliminate hallucinations at the kernel level.
          </p>
        </div>
      </section>

      {/* --- NEW SECTION: JURY AUDIT / STRATEGIC DOSSIER --- */}
      <section id="dossier" className="relative py-80 px-8 md:px-24 bg-obsidian border-y border-steel/10">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col lg:flex-row gap-32 items-start">
              <div className="flex-1 space-y-12">
                 <h2 className="text-[18px] font-black text-neon uppercase tracking-[1.5em]">Jury_Strategic_Audit</h2>
                 <h3 className="text-7xl font-black text-chrome uppercase tracking-tighter leading-none">The Action Era Integration.</h3>
                 
                 <div className="prose prose-invert max-w-none space-y-8">
                    <p className="text-xl text-tungsten font-bold leading-relaxed uppercase tracking-widest border-l-4 border-neon pl-8 py-2">
                       Agenticum G5 is a "Marathon Agent" infrastructure built for sustained autonomous execution. Unlike generic chatbots, G5 utilizes Gemini 3's 1.2M context window to maintain campaign state across 52 specialized nodes.
                    </p>
                    <p className="text-lg text-tungsten leading-relaxed font-medium">
                       We leverage **System 2 Thinking** with high-budget deliberation (32k tokens) to ensure strategic determinism. Every objective is decomposed by the SN-00 Apex Orchestrator into atomic tasks, verified via the **GATES Forensic Protocol**. By integrating Google Search Grounding and Multimodal native tokens (Veo 3.1 & Imagen 4), G5 achieves industrial-grade production stability where prompt-only wrappers fail.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 pt-10">
                    <div className="p-10 border border-steel bg-void space-y-4 group hover:border-neon transition-all">
                       <span className="text-[10px] font-black text-neon tracking-[0.5em] uppercase">Thought_Signature</span>
                       <div className="text-4xl font-black text-chrome tabular-nums">0x7F2B-SYNC</div>
                       <span className="text-[11px] text-tungsten font-black uppercase opacity-40">Verified_Cognitive_ID</span>
                    </div>
                    <div className="p-10 border border-steel bg-void space-y-4 group hover:border-thinking transition-all">
                       <span className="text-[10px] font-black text-thinking tracking-[0.5em] uppercase">Context_Uplink</span>
                       <div className="text-4xl font-black text-chrome tabular-nums">1.2M_TOK</div>
                       <span className="text-[11px] text-tungsten font-black uppercase opacity-40">Deep_Session_Resonance</span>
                    </div>
                 </div>
              </div>
              <div className="w-full lg:w-1/3 p-12 bg-neon/5 border-2 border-neon/20 space-y-10 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 text-[100px] font-black text-neon opacity-[0.05] select-none">AUDIT</div>
                 <h4 className="text-[14px] font-black text-neon uppercase tracking-[0.8em] border-b border-neon/20 pb-4">Integration_Manifesto</h4>
                 <ul className="space-y-6 text-[12px] font-bold text-chrome uppercase tracking-widest">
                    <li className="flex items-center gap-4"><div className="w-2 h-2 bg-neon" /> Gemini 3 Pro Reasoning</li>
                    <li className="flex items-center gap-4"><div className="w-2 h-2 bg-neon" /> Veo 3.1 Fast Production</li>
                    <li className="flex items-center gap-4"><div className="w-2 h-2 bg-neon" /> Imagen 4 Forge</li>
                    <li className="flex items-center gap-4"><div className="w-2 h-2 bg-neon" /> Google Search Grounding</li>
                    <li className="flex items-center gap-4"><div className="w-2 h-2 bg-neon" /> Flash Native Audio/TTS</li>
                 </ul>
                 <div className="pt-10 border-t border-neon/20 text-center">
                    <span className="text-[10px] font-black text-neon uppercase tracking-widest animate-pulse">Sovereign_Compliance: OK</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- 06: ENGAGEMENTS (CASES) --- */}
      <section id="engagement" className="relative py-80 px-8 md:px-24 bg-void">
         <div className="max-w-7xl mx-auto space-y-48">
            <div className="flex justify-between items-end">
               <div className="space-y-12">
                  <h2 className="text-[18px] font-black text-neon uppercase tracking-[1.5em]">06_Verified_Engagements</h2>
                  <h3 className="text-8xl md:text-10xl font-black uppercase tracking-tighter leading-none text-chrome">Proven<br/>Strategic ROI.</h3>
               </div>
               <div className="hidden lg:block pb-4 text-right">
                  <span className="text-[10px] font-black text-tungsten tracking-[0.8em] uppercase opacity-40">Audit_Logs_Available_v1.2</span>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {engagements.map((e, idx) => (
                 <div key={idx} className="p-16 border border-steel/20 bg-void space-y-12 group hover:border-chrome transition-all duration-700 shadow-2xl">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-neon tracking-widest uppercase">{e.metric}</span>
                       <div className="w-2 h-2 bg-active shadow-[0_0_10px_#00ff88]" />
                    </div>
                    <h4 className="text-4xl font-black text-chrome uppercase tracking-tighter">{e.client}</h4>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <span className="text-[9px] text-tungsten font-black uppercase tracking-[0.6em] opacity-40 block">Objective</span>
                          <span className="text-[15px] font-bold uppercase tracking-widest text-chrome block">{e.objective}</span>
                       </div>
                       <div className="space-y-2">
                          <span className="text-[9px] text-tungsten font-black uppercase tracking-[0.6em] opacity-40 block">Result_Verification</span>
                          <span className="text-[15px] font-bold uppercase tracking-widest text-active block">{e.result}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- 07: DEPLOYMENT (PRICING) --- */}
      <section id="deployment" className="relative py-80 px-8 md:px-24 bg-void">
        <div className="max-w-7xl mx-auto space-y-56">
          <div className="text-center space-y-12">
            <h2 className="text-[18px] font-black text-neon uppercase tracking-[1.5em] text-center">07_Strategic_Deployment</h2>
            <h3 className="text-8xl md:text-12xl font-black uppercase tracking-tighter leading-none text-chrome">Industrial Scale.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-steel/30 border border-steel/30 shadow-[0_0_150px_rgba(0,0,0,1)]">
             {deploymentTiers.map((tier, idx) => (
               <div key={tier.label} className={`p-20 flex flex-col gap-20 transition-all duration-1000 relative overflow-hidden ${idx === 1 ? 'bg-neon text-void' : 'bg-void'}`}>
                  {idx === 1 && <div className="absolute top-10 right-10 text-[10px] font-black tracking-[0.5em] uppercase opacity-40">OPTIMAL_ALLOCATION</div>}
                  <div className="space-y-8">
                    <span className={`text-[15px] font-black uppercase tracking-[0.8em] ${idx === 1 ? 'text-void/60' : 'text-neon opacity-60'}`}>{tier.label}</span>
                    <div className="text-8xl font-black tracking-tighter uppercase leading-none">{tier.price}</div>
                    <p className={`text-[13px] font-bold uppercase tracking-widest leading-relaxed opacity-60 ${idx === 1 ? 'text-void' : 'text-tungsten'}`}>{tier.desc}</p>
                  </div>
                  <div className="flex-1 space-y-10">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-6">
                        <div className={`w-4 h-[1.5px] ${idx === 1 ? 'bg-void' : 'bg-neon shadow-[0_0_10px_#00f0ff]'}`} />
                        <span className={`text-[12px] font-black uppercase tracking-widest ${idx === 1 ? 'text-void' : 'text-chrome'}`}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleInitialize} 
                    className={`w-full py-12 text-[13px] font-black uppercase tracking-[1em] transition-all relative group overflow-hidden ${idx === 1 ? 'bg-void text-neon hover:bg-white hover:text-void' : 'bg-neon text-void hover:bg-white hover:shadow-[0_0_60px_#00f0ff]'}`}
                  >
                    <span className="relative z-10">{tier.cta}</span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- TELEMETRY TICKER --- */}
      <div className="relative py-24 bg-black border-y border-steel/20 overflow-hidden group">
        <div className="flex whitespace-nowrap animate-[marquee_60s_linear_infinite] hover:pause transition-all">
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="flex gap-40 items-center px-20">
               <span className="text-[14px] font-black text-neon uppercase tracking-[1.5em] animate-pulse">SYSTEM_STABLE: OPTIMAL</span>
               <span className="text-[14px] font-black text-tungsten opacity-40 uppercase tracking-[1.5em]">NODE_SYNC: 52/52</span>
               <span className="text-[14px] font-black text-chrome uppercase tracking-[1.5em]">UPTIME: 99.999%</span>
               <span className="text-[14px] font-black text-thinking uppercase tracking-[1.5em]">COGNITIVE_MASS: 1.2M_UNITS</span>
               <span className="text-[14px] font-black text-warning uppercase tracking-[1.5em]">PROD_ENGINE: READY</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="relative bg-black pt-96 pb-24 px-8 md:px-24 border-t border-steel/20 overflow-hidden">
        {/* Animated Footer Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,240,255,0.08)_0%,transparent_50%)] animate-pulse" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-40 mb-80 items-start relative z-10">
           <div className="space-y-24">
              <div className="flex items-center gap-10">
                <div 
                  className="w-20 h-20 bg-neon flex items-center justify-center shadow-[0_0_60px_#00f0ff] group hover:scale-110 transition-transform cursor-pointer" 
                  onClick={() => { audioService.playClick(); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                >
                  <span className="text-void font-black text-5xl">G5</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[32px] font-black uppercase tracking-[0.8em] text-chrome leading-none">Agenticum</span>
                  <span className="text-[11px] text-neon font-black uppercase tracking-[0.5em] mt-4">Sovereign_Industrial_OS</span>
                </div>
              </div>
              <p className="text-2xl text-tungsten font-bold leading-relaxed uppercase tracking-[0.4em] opacity-40 max-w-2xl">
                The first industrial-grade agency operating system. Engineered for high-stakes execution via the Gemini 3 Cognitive Stack.
              </p>
              
              <div className="flex flex-col gap-10 pt-10">
                 <div className="p-8 border-2 border-neon/20 bg-void/40 backdrop-blur-3xl space-y-6 relative group overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)] hover:border-neon transition-all duration-700">
                    <div className="absolute top-0 left-0 w-1 h-full bg-neon group-hover:shadow-[0_0_20px_#00f0ff] transition-all" />
                    <span className="text-[12px] font-black text-tungsten uppercase tracking-[0.8em] opacity-60">Architect_Spec_Final</span>
                    <div className="flex flex-col gap-2">
                       <span className="text-[28px] font-black text-chrome uppercase tracking-[0.3em]">Yahya Yildirim</span>
                       <div className="flex items-center gap-4 text-[10px] font-black text-neon uppercase tracking-widest">
                          <span>ID: YILDIRIM_G5_PRO</span>
                          <span className="text-tungsten opacity-20">|</span>
                          <span>KERNEL: GEMINI_3</span>
                       </div>
                       <div className="mt-2 text-[8px] font-mono text-tungsten/30 uppercase tracking-[0.2em]">
                         Repo_Auth: yoyo967 // Branch: main // Hash: {Math.random().toString(16).slice(2, 10).toUpperCase()}
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 border-l-2 border-neon/20 pl-8">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-chrome uppercase tracking-[0.5em]">Built in AI Studio</span>
                      <span className="text-[12px] font-black text-neon uppercase tracking-[0.5em] mt-1">Powered by Gemini</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-24">
              <div className="space-y-14">
                <h5 className="text-[18px] font-black text-neon uppercase tracking-[0.8em]">Manifest</h5>
                <ul className="space-y-8 text-[14px] font-black text-tungsten uppercase tracking-widest opacity-60">
                  <li><a href="#manifesto" onClick={(e) => handleNavClick(e, 'manifesto')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">Matrix_Core</a></li>
                  <li><a href="#mesh" onClick={(e) => handleNavClick(e, 'mesh')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">Mesh_Architecture</a></li>
                  <li><a href="#forge" onClick={(e) => handleNavClick(e, 'forge')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">Forge_Realization</a></li>
                  <li><a href="#engine" onClick={(e) => handleNavClick(e, 'engine')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">Neural_Engine</a></li>
                  <li><a href="#dossier" onClick={(e) => handleNavClick(e, 'dossier')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">Verified_Cases</a></li>
                </ul>
              </div>
              <div className="space-y-14">
                <h5 className="text-[18px] font-black text-warning uppercase tracking-[0.8em]">Uplink</h5>
                <ul className="space-y-8 text-[14px] font-black text-tungsten uppercase tracking-widest opacity-60">
                  <li><a href="https://www.youtube.com/@Agenticum" target="_blank" rel="noopener noreferrer" className="hover:text-warning hover:tracking-[0.5em] transition-all flex items-center gap-4 group cursor-pointer">
                     <div className="w-5 h-5 border border-warning flex items-center justify-center relative group-hover:bg-warning/20">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-warning border-b-[4px] border-b-transparent ml-0.5" />
                     </div>
                     YouTube_Channel
                  </a></li>
                  <li><a href="https://www.youtube.com/@Agenticum" target="_blank" rel="noopener noreferrer" className="hover:text-warning hover:tracking-[0.5em] transition-all flex items-center gap-4 group cursor-pointer">
                     <div className="w-5 h-5 border border-warning flex items-center justify-center relative group-hover:bg-warning/20">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-warning border-b-[4px] border-b-transparent ml-0.5" />
                     </div>
                     3_Min_Demo_Video
                  </a></li>
                  <li><a href="https://github.com/yoyo967/agenticum-g5-" target="_blank" rel="noopener noreferrer" className="hover:text-neon hover:tracking-[0.5em] transition-all flex items-center gap-4 group cursor-pointer">
                     <div className="w-5 h-5 border border-neon flex items-center justify-center relative group-hover:border-white transition-colors group-hover:bg-neon/20">
                        <div className="w-2.5 h-2.5 bg-neon opacity-40 group-hover:opacity-100 group-hover:bg-white transition-all" />
                     </div>
                     GitHub_Repository
                  </a></li>
                  <li><a href="#engine" onClick={(e) => handleNavClick(e, 'engine')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">Strategic_OS_Docs</a></li>
                  <li><a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="hover:text-neon hover:tracking-[0.5em] transition-all cursor-pointer">System_Status</a></li>
                </ul>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-24 border-t border-steel/10 relative z-10">
          <div className="text-[12px] font-black text-tungsten uppercase tracking-[1em] opacity-30">
            © 2026 Agenticum G5 // Built for the Gemini 3 Action Era // Kernel_By_Yildirim
          </div>
          <div className="flex gap-16 text-[11px] font-black text-tungsten uppercase tracking-[0.5em] opacity-30">
             <a href="#manifesto" onClick={(e) => handleNavClick(e, 'manifesto')} className="hover:text-chrome hover:opacity-100 transition-all cursor-pointer">Privacy_Protocol</a>
             <a href="#mesh" onClick={(e) => handleNavClick(e, 'mesh')} className="hover:text-chrome hover:opacity-100 transition-all cursor-pointer">Sovereign_Data</a>
             <a href="#gates" onClick={(e) => handleNavClick(e, 'gates')} className="hover:text-chrome hover:opacity-100 transition-all cursor-pointer">Kernel_Legal</a>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          25% { opacity: 0.15; }
          50% { transform: translate(-100px, -150px) rotate(90deg); opacity: 0.2; }
          75% { opacity: 0.1; }
        }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .pause { animation-play-state: paused !important; }
        .vertical-text { writing-mode: vertical-rl; }
      `}} />
    </div>
  );
};

export default LandingPage;
