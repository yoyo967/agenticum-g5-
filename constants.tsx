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

export const NODE_MANIFEST: AgentNode[] = [
  { id: 'SN-00', name: 'Global Orchestrator', cluster: 'APEX', status: NodeStatus.ONLINE, load: 12, description: 'Central CNS governing objective decomposition.' },
  { id: 'SN-21', name: 'Live Coordinator', cluster: 'APEX', status: NodeStatus.ONLINE, load: 5, description: 'Real-time audio and Live API synchronizer.' },
  
  { id: 'SP-01', name: 'Strategic Visionary', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 15, description: 'High-budget probability and causal simulation.' },
  { id: 'SP-11', name: 'Hegemony Matrix', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 8, description: 'Market dominance and competitive modeling.' },
  { id: 'SP-111', name: 'System 2 Architect', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 20, description: 'Complex reasoning and decision tree specialist.' },

  { id: 'RA-01', name: 'Forensic Researcher', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 10, description: 'Google Search grounding and truth verification.' },
  { id: 'RA-29', name: 'Regulatory Sandbox', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 2, description: 'Isolated legal and ethical compliance testing.' },
  { id: 'RA-52', name: 'Adversarial Defense', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 5, description: 'IP protection and deep-fake mitigation unit.' },
  { id: 'RA-55', name: 'Strategic Truth Validator', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 7, description: 'Master node for GATES Protocol execution.' },
  { id: 'RA-58', name: 'Bias Forensic Audit', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 4, description: 'Real-time algorithmic fairness monitoring.' },

  { id: 'CC-01', name: 'Copy Chief', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 18, description: 'High-conversion textual asset synthesis.' },
  { id: 'CC-06', name: 'Video Director', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 30, description: 'Veo 3.1 cinematic generation lead.' },
  { id: 'CC-10', name: 'Art Director', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 25, description: 'Imagen 4 high-fidelity graphic production.' },
  { id: 'CC-12', name: 'Acoustic Engineer', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 12, description: 'TTS and multi-speaker audio synthesis.' },

  { id: 'MI-01', name: 'Policy Governor', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 5, description: 'Global compliance and safety gateway.' },
  { id: 'DT-01', name: 'Capital Simulation', cluster: 'FINANCE', status: NodeStatus.ONLINE, load: 15, description: 'Fiscal modeling and M&A simulation.' }
];

// Populate the remaining 52 nodes to complete the "Perfect Twin" agency
for (let i = NODE_MANIFEST.length; i < 52; i++) {
  const clusters: ClusterType[] = ['EDUCATION', 'SPECIAL_OPS', 'GOVERNANCE', 'FINANCE'];
  const cluster = clusters[i % clusters.length];
  NODE_MANIFEST.push({
    id: `${CLUSTERS[cluster].prefix}-${String(i).padStart(2, '0')}`,
    name: `Support Agent ${i}`,
    cluster: cluster,
    status: NodeStatus.ONLINE,
    load: 2,
    description: 'General purpose cognitive compute resource.'
  });
}

export const ICONS = {
  Node: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    </svg>
  ),
  Terminal: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Cpu: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>
    </svg>
  )
};
