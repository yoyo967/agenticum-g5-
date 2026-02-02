
export enum NodeStatus {
  ONLINE = 'ONLINE',
  PROCESSING = 'PROCESSING',
  WARNING = 'WARNING',
  OFFLINE = 'OFFLINE',
}

export type ClusterType = 
  | 'APEX' 
  | 'STRATEGY' 
  | 'INTELLIGENCE' 
  | 'CREATION' 
  | 'GOVERNANCE' 
  | 'FINANCE' 
  | 'EDUCATION' 
  | 'SPECIAL_OPS';

export interface Artifact {
  type: 'text' | 'image' | 'video' | 'audio' | 'json';
  content: string;
  metadata: Record<string, any>;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface NodeOutput {
  nodeId: string;
  status: 'success' | 'error' | 'pending';
  data: any;
  artifacts?: Artifact[];
  grounding?: GroundingChunk[];
  reasoning?: string;
  executionTime: number;
}

export interface AgentNode {
  id: string;
  name: string;
  cluster: ClusterType;
  status: NodeStatus;
  load: number;
  description: string;
}

export interface TraceEntry {
  id: string;
  timestamp: string;
  sender: 'USER' | 'AGENT' | 'SYSTEM' | 'THOUGHT';
  content: string;
  type: 'text' | 'code' | 'thinking' | 'image' | 'video' | 'audio';
  metadata?: {
    nodeId?: string;
    tokensUsed?: number;
    latency?: number;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    artifacts?: Artifact[];
    grounding?: GroundingChunk[];
  };
}

export interface DeploymentConfig {
  thinkingBudget: number;
  maxTokens: number;
  nodeId: string;
  imageSize?: '1K' | '2K' | '4K';
  aspectRatio?: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
  useMaps?: boolean;
  useSearch?: boolean;
}

export interface FileData {
  data: string;
  mimeType: string;
}
