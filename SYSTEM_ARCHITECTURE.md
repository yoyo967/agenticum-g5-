# AGENTICUM G5 - SYSTEM ARCHITECTURE (v5.0.2)

## 1. CORE PHILOSOPHY
The AGENTICUM G5 is a decentralized intelligence fabric. Unlike traditional linear LLM interfaces, G5 operates on a "Fractal Node" basis where each of the 52 agents is a specialized cognitive instance with unique system instructions and tool access.

## 2. COMPONENT TOPOLOGY

### 2.1 VIEWPORT ORCHESTRATOR
- **Lazy Loading Strategy:** Only the active node and the primary console shell are resident in memory. Clusters are initialized on-demand.
- **State Management:** Powered by a centralized `NodeStore` that tracks telemetry, logs, and token allocation across the 52-node fabric.

### 2.2 COGNITIVE ENGINE (GEMINI 3 PRO)
- **Context Handling:** Optimized for 1M+ token sessions, allowing the Orchestrator (SN-00) to maintain high-fidelity state across long-running campaign strategy sessions.
- **Thinking Budget:** Dynamically allocated. Strategy nodes (SP-series) default to high-budget reasoning (24k tokens), while Action nodes (CC-series) prioritize low-latency output.

### 2.3 THE DATA FABRIC
- **NodeManifest:** JSON-based configuration defining the identity, cluster affiliation, and specific sub-routine of each node.
- **Telemetry Loop:** Real-time feedback from the Gemini API (latency, token usage) is mapped back to the UI to provide the "cockpit" feel.

## 3. SECURITY & COMPLIANCE
- **Encrypted Tunneling:** All traffic is handled via secure API gateways.
- **Governance Layer:** MI-series (Governance) nodes are interjected during output synthesis to ensure GDPR and ethical AI compliance (MI-01, MI-02).

## 4. DEPLOYMENT PIPELINE
- **Frontend:** Vite-optimized React deployment with industrial "Obsidian & Chrome" design tokens.
- **Orchestration:** Serverless Firebase Functions acting as the secure bridge to the Gemini 3 API.
