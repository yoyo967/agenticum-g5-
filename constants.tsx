
import React from 'react';
import { ClusterType, AgentNode, NodeStatus } from './types';

export const CLUSTERS: Record<ClusterType, { label: string; prefix: string }> = {
  APEX: { label: 'Cluster 0: Apex', prefix: 'SN' },
  STRATEGY: { label: 'Cluster 1: Strategy', prefix: 'SP' },
  INTELLIGENCE: { label: 'Cluster 2: Intelligence', prefix: 'RA' },
  CREATION: { label: 'Cluster 3: Creation', prefix: 'CC' },
  GOVERNANCE: { label: 'Cluster 4: Governance', prefix: 'MI' },
  FINANCE: { label: 'Cluster 5: Finance', prefix: 'DT' },
  EDUCATION: { label: 'Cluster 6: Education', prefix: 'ED' },
  SPECIAL_OPS: { label: 'Cluster 7: Special Ops', prefix: 'PS' },
};

// FULL 52-NODE MANIFEST FOR SOVEREIGN_OS v5.0.2
export const NODE_MANIFEST: AgentNode[] = [
  // CLUSTER 0: APEX (1 Node)
  { id: 'SN-00', name: 'Global Orchestrator', cluster: 'APEX', status: NodeStatus.ONLINE, load: 0, description: 'Central CNS governing objective decomposition.' },
  
  // CLUSTER 1: STRATEGY (7 Nodes)
  { id: 'SP-01', name: 'Strategic Lead', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'High-budget causal reasoning.' },
  { id: 'SP-02', name: 'Market Architect', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'Economic structural analysis.' },
  { id: 'SP-03', name: 'Scenario Engine', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'Probabilistic future modeling.' },
  { id: 'SP-04', name: 'Brand Sovereignty', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'Identity alignment protocols.' },
  { id: 'SP-05', name: 'Risk Mitigator', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'Operational vulnerability scan.' },
  { id: 'SP-06', name: 'Global Scale Unit', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'International expansion logic.' },
  { id: 'SP-99', name: 'Chaos Controller', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'Black-swan event resilience.' },

  // CLUSTER 2: INTELLIGENCE (8 Nodes)
  { id: 'RA-01', name: 'Market Intel', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Real-time trend forensics.' },
  { id: 'RA-02', name: 'Competitor Radar', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Rival maneuver tracking.' },
  { id: 'RA-03', name: 'Sentiment Deep', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Neural emotion decoding.' },
  { id: 'RA-04', name: 'Data Miner Alpha', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Unstructured data synthesis.' },
  { id: 'RA-05', name: 'Signal Filter', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Noise-to-value distillation.' },
  { id: 'RA-06', name: 'Geopolitical Scan', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Macro-environmental tracking.' },
  { id: 'RA-07', name: 'Tech Scout', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Emerging tech integration.' },
  { id: 'RA-52', name: 'Adversarial Defense', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Deep-fake and IP shield.' },

  // CLUSTER 3: CREATION (12 Nodes)
  { id: 'CC-01', name: 'Copy Chief', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Multi-platform narrative synthesis.' },
  { id: 'CC-02', name: 'Concept Artist', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Initial visual ideation.' },
  { id: 'CC-03', name: 'UX Designer', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Interface behavior modeling.' },
  { id: 'CC-04', name: 'Motion Lead', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Dynamic movement synthesis.' },
  { id: 'CC-05', name: 'Script Writer', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Cinematic narrative flow.' },
  { id: 'CC-06', name: 'Cinema Lead', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Veo 3.1 video generation.' },
  { id: 'CC-07', name: 'Music Synthesizer', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Atmospheric audio forge.' },
  { id: 'CC-08', name: '3D Modeler', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Spatial asset construction.' },
  { id: 'CC-09', name: 'Colorist', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Visual mood calibration.' },
  { id: 'CC-10', name: 'Art Director', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Imagen 3 Pro visual lead.' },
  { id: 'CC-11', name: 'Typography Engine', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Font-mesh optimization.' },
  { id: 'CC-12', name: 'Voice Engineer', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'High-fidelity TTS synth.' },

  // CLUSTER 4: GOVERNANCE (6 Nodes)
  { id: 'MI-01', name: 'Policy Governor', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'Compliance gateway.' },
  { id: 'MI-02', name: 'Ethical Auditor', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'Bias detection protocols.' },
  { id: 'MI-03', name: 'Legal Counsel', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'IP rights verification.' },
  { id: 'MI-04', name: 'Privacy Shield', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'Data protection enforcement.' },
  { id: 'MI-05', name: 'Brand Guardian', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'Consistency monitoring.' },
  { id: 'MI-06', name: 'Sustainability Monitor', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'ESG metric tracking.' },

  // CLUSTER 5: FINANCE (6 Nodes)
  { id: 'DT-01', name: 'Budget Allocator', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 0, description: 'Resource distribution.' },
  { id: 'DT-02', name: 'ROI Predictor', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 0, description: 'Profitability forecasting.' },
  { id: 'DT-03', name: 'Procurement Lead', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 0, description: 'Asset acquisition.' },
  { id: 'DT-04', name: 'Audit Log', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 0, description: 'Financial transparency.' },
  { id: 'DT-05', name: 'Risk Capitalist', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 0, description: 'Investment strategy.' },
  { id: 'DT-06', name: 'Tax Compliance', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 0, description: 'Regulatory finance scan.' },

  // CLUSTER 6: EDUCATION (6 Nodes)
  { id: 'ED-01', name: 'Knowledge Base', cluster: 'EDUCATION', status: NodeStatus.ONLINE, load: 0, description: 'Historical data storage.' },
  { id: 'ED-02', name: 'Learning Loop', cluster: 'EDUCATION', status: NodeStatus.ONLINE, load: 0, description: 'Self-improvement logic.' },
  { id: 'ED-03', name: 'Training Module', cluster: 'EDUCATION', status: NodeStatus.ONLINE, load: 0, description: 'Human onboarding assist.' },
  { id: 'ED-04', name: 'Doc Generator', cluster: 'EDUCATION', status: NodeStatus.ONLINE, load: 0, description: 'Technical documentation.' },
  { id: 'ED-05', name: 'Case Study Lead', cluster: 'EDUCATION', status: NodeStatus.ONLINE, load: 0, description: 'Retrospective analysis.' },
  { id: 'ED-06', name: 'Curriculum Synth', cluster: 'EDUCATION', status: NodeStatus.ONLINE, load: 0, description: 'Dynamic training plans.' },

  // CLUSTER 7: SPECIAL OPS (6 Nodes)
  { id: 'PS-01', name: 'Rapid Deployment', cluster: 'SPECIAL_OPS', status: NodeStatus.ONLINE, load: 0, description: 'Instant response logic.' },
  { id: 'PS-02', name: 'Stealth Growth', cluster: 'SPECIAL_OPS', status: NodeStatus.ONLINE, load: 0, description: 'Under-the-radar marketing.' },
  { id: 'PS-03', name: 'Viral Catalyst', cluster: 'SPECIAL_OPS', status: NodeStatus.ONLINE, load: 0, description: 'Social trigger analysis.' },
  { id: 'PS-04', name: 'Ghost Writer', cluster: 'SPECIAL_OPS', status: NodeStatus.ONLINE, load: 0, description: 'Persona-based synthesis.' },
  { id: 'PS-05', name: 'Edge Case Lead', cluster: 'SPECIAL_OPS', status: NodeStatus.ONLINE, load: 0, description: 'Non-standard resolution.' },
  { id: 'PS-06', name: 'Final Oversight', cluster: 'SPECIAL_OPS', status: NodeStatus.ONLINE, load: 0, description: 'Pre-launch kill switch.' }
];

export const ICONS = {
  Node: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <rect x="2" y="2" width="20" height="8" />
      <rect x="2" y="14" width="20" height="8" />
      <path d="M6 10v4M18 10v4" />
    </svg>
  ),
  Terminal: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  ),
  Activity: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Cpu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <rect x="4" y="4" width="16" height="16" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  Vault: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  )
};
