
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { DeploymentConfig, NodeOutput, FileData, Artifact, GroundingChunk } from "../types";

const CLUSTER_DIRECTIVES: Record<string, string> = {
  APEX: `ACT AS THE CENTRAL ORCHESTRATOR. YOU ARE A SWARM COMPILER.
  YOUR ONLY OUTPUT IS A VALID JSON MISSION PLAN. 
  NEVER EXPLAIN ANYTHING. NEVER START WITH TEXT.
  CONVERT USER INTENT INTO 4-Node PRODUCTION PLAN.
  MANDATORY NODES: 
  - RA-01 (Intel Research)
  - SP-01 (Strategic Blueprint)
  - CC-10 (High-End Key Visual)
  - CC-06 (Cinematic Video Trailer)
  
  SCHEMA: {"objectives": [{"id": "string", "label": "string", "assignedNode": "string", "description": "DETAILED_PROMPT_FOR_GENERATOR", "type": "RESEARCH|STRATEGY|IMAGE|VIDEO"}]}`,
  STRATEGY: "You are the Strategic Lead. Deliver a high-stakes business blueprint. Focus on ROI and market penetration.",
  INTELLIGENCE: "You are the Intelligence Node. Use tools to find real data. Ground every claim.",
  CREATION: "You are the Creative Forge. Generate industrial, cinematic visual assets in Obsidian & Chrome style.",
  NEURAL_MIRROR: "Adversarial Critic. Identify flaws and suggest 10x improvements."
};

/**
 * Sanitizes model output to extract valid JSON
 */
const sanitizeJson = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const executeNodeAction = async (
  prompt: string,
  config: DeploymentConfig,
  isPlanning: boolean = false,
  useMirror: boolean = false,
  taskType?: string,
  files?: FileData[]
): Promise<NodeOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const startTime = Date.now();
  const nodeId = config.nodeId;

  try {
    const fileParts = (files || []).map(f => ({
      inlineData: { data: f.data, mimeType: f.mimeType }
    }));

    // --- AUTONOMOUS PRODUCTION: VIDEO (Veo 3.1) ---
    if (taskType === 'VIDEO' || nodeId === 'CC-06') {
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Obsidian & Chrome aesthetic, high-end industrial product trailer, cinematic lighting, ultra-detailed: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });
      
      let result = operation;
      while (!result.done) {
        await new Promise(r => setTimeout(r, 10000));
        result = await ai.operations.getVideosOperation({ operation: result });
      }

      const downloadLink = result.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video download link missing from response");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error(`Video fetch failed: ${response.statusText}`);
      
      const blob = await response.blob();
      const base64Video = await new Promise<string>(r => {
        const reader = new FileReader();
        reader.onloadend = () => r(reader.result as string);
        reader.readAsDataURL(blob);
      });

      return {
        nodeId, status: 'success', data: "Video synthesis complete.",
        artifacts: [{ type: 'video', content: base64Video, label: `${nodeId}_VEO_PRODUCTION`, metadata: { nodeId } }],
        executionTime: Date.now() - startTime
      };
    }

    // --- AUTONOMOUS PRODUCTION: IMAGE (Imagen 4) ---
    if (taskType === 'IMAGE' || nodeId === 'CC-10') {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Obsidian and Chrome industrial aesthetic, dark moody cinematic lighting, product photography, 8k: ${prompt}`,
        config: { numberOfImages: 1, aspectRatio: '16:9' }
      });
      
      if (!response.generatedImages?.[0]?.image?.imageBytes) {
        throw new Error("Image bytes missing from response");
      }

      const base64Image = `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
      return { 
        nodeId, status: 'success', data: "Image synthesis complete.", 
        artifacts: [{ type: 'image', content: base64Image, label: `${nodeId}_HIGH_FIDELITY`, metadata: { nodeId } }], 
        executionTime: Date.now() - startTime 
      };
    }

    // --- INTELLIGENCE & STRATEGY (Gemini 3 Pro) ---
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [...fileParts, { text: prompt }] },
      config: {
        systemInstruction: CLUSTER_DIRECTIVES[config.nodeId.split('-')[0]] || CLUSTER_DIRECTIVES.STRATEGY,
        tools: (nodeId.startsWith('RA') && !isPlanning) ? [{ googleSearch: {} }] : undefined,
        responseMimeType: isPlanning ? "application/json" : undefined,
        thinkingConfig: { thinkingBudget: isPlanning ? 32000 : 8000 }
      }
    });

    const jsonText = isPlanning ? sanitizeJson(response.text || "{}") : "";
    const artifacts: Artifact[] = [];
    if (!isPlanning) {
      artifacts.push({ type: 'report', content: response.text || "", label: `${nodeId}_DOSSIER`, metadata: { nodeId } });
    }

    return {
      nodeId, status: 'success', data: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      artifacts,
      plan: isPlanning ? JSON.parse(jsonText).objectives : undefined,
      executionTime: Date.now() - startTime,
      thoughtSignature: Math.random().toString(16).slice(2, 10).toUpperCase()
    };
  } catch (error: any) {
    console.error("Execution Error:", error);
    return { nodeId, status: 'error', data: error.message, executionTime: 0 };
  }
};

export const generateBriefingAudio = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `High-stakes strategic summary: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      }
    }
  });
  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64 ? `data:audio/wav;base64,${base64}` : '';
};
