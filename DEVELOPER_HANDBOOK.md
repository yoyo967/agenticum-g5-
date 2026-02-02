# AGENTICUM G5 - DEVELOPER HANDBOOK FOR ANTIGRAVITY AGENTS

**CLASSIFICATION:** TECHNICAL IMPLEMENTATION GUIDE  
**TARGET:** Google Antigravity AI Agents  
**OBJECTIVE:** Build a production-ready autonomous marketing OS for Gemini 3 Hackathon  
**TIMELINE:** 9 Days  
**TECHNOLOGY STACK:** Next.js 15 + Gemini 3 API + Antigravity  

---

## MISSION BRIEFING

You are AI agents operating within Google Antigravity. Your mission is to build **AGENTICUM G5** - an autonomous marketing operating system that orchestrates 52 specialized AI nodes to execute complete marketing campaigns with minimal human intervention.

**CRITICAL REQUIREMENTS:**
1. ✅ Code must be **production-ready**, not placeholder/mock code
2. ✅ Must use **real Gemini 3 API integration** (Pro, Veo 3.1, Flash Audio)
3. ✅ Must be **deployable to Vercel** within 9 days
4. ✅ Must demonstrate **true autonomy** (not just a chatbot)
5. ✅ Must generate **verifiable artifacts** (videos, documents, strategies)

---

## SYSTEM ARCHITECTURE OVERVIEW

```
AGENTICUM G5
│
├── Frontend (Next.js 15 + React 19)
│   ├── Control Panel (VS Code-inspired UI)
│   ├── Node Visualization (52 autonomous agents)
│   ├── Real-time Console (System logs)
│   └── Asset Preview (Generated outputs)
│
├── Backend (Next.js API Routes)
│   ├── Orchestrator (SN-00)
│   ├── Node Router
│   ├── Gemini API Integration
│   └── Asset Storage
│
├── Node System (52 Specialized Agents)
│   ├── Strategy Cluster (SP-01, SP-99)
│   ├── Research Cluster (RA-01, RA-06)
│   ├── Content Cluster (CC-01, CC-06, CC-12)
│   ├── Audit Layer (MI-01)
│   └── Learning Layer (ED-01, ED-42)
│
└── Gemini Integration Layer
    ├── Gemini 3 Pro (Reasoning)
    ├── Veo 3.1 (Video Generation)
    └── Flash Audio (Voice Synthesis)
```

---

## IMPLEMENTATION NOTES
- **Orchestrator (SN-00):** Analyzes user intent and determines the execution plan.
- **Node Execution:** Can be sequential or parallel based on complexity.
- **Grounding:** Use Google Search for Research nodes (RA-series).
- **Multimodality:** Use Imagen for CC-10 and Veo for CC-06.
```