
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

// The Elite 8 primary nodes, part of a wider 52-node fabric
export const NODE_MANIFEST: AgentNode[] = [
  { id: 'SN-00', name: 'Global Orchestrator', cluster: 'APEX', status: NodeStatus.ONLINE, load: 0, description: 'Central CNS governing objective decomposition and high-level mission alignment.' },
  { id: 'RA-01', name: 'Market Intel', cluster: 'INTELLIGENCE', status: NodeStatus.ONLINE, load: 0, description: 'Real-time grounding and trend forensics using high-fidelity search nodes.' },
  { id: 'SP-01', name: 'Strategic Lead', cluster: 'STRATEGY', status: NodeStatus.ONLINE, load: 0, description: 'High-budget causal reasoning and strategic narrative architecture.' },
  { id: 'CC-01', name: 'Copy Chief', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Multi-platform textual asset synthesis and brand voice calibration.' },
  { id: 'CC-10', name: 'Art Director', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Imagen 3 Pro high-fidelity graphic production and visual style guide enforcement.' },
  { id: 'CC-06', name: 'Cinema Lead', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'Veo 3.1 cinematic video generation and dynamic sequence synthesis.' },
  { id: 'CC-12', name: 'Voice Engineer', cluster: 'CREATION', status: NodeStatus.ONLINE, load: 0, description: 'High-fidelity TTS and acoustic artifact synthesis for brand briefings.' },
  { id: 'MI-01', name: 'Policy Governor', cluster: 'GOVERNANCE', status: NodeStatus.ONLINE, load: 0, description: 'Final compliance and sovereign safety gateway for all synthesized artifacts.' }
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
