
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { DeploymentConfig, NodeOutput, FileData, Artifact, GroundingChunk } from "../types";

const CLUSTER_DIRECTIVES: Record<string, string> = {
  APEX: `ACT AS THE CENTRAL ORCHESTRATOR. YOUR ONLY OUTPUT IS A VALID JSON MISSION PLAN. 
  CONVERT USER INTENT INTO A 4-NODE PRODUCTION PLAN.
  REQUIRED NODES: RA-01 (Intel), SP-01 (Strategy), CC-10 (Image), CC-06 (Video).
  SCHEMA: {"objectives": [{"id": "string", "label": "string", "assignedNode": "string", "description": "PROMPT", "type": "RESEARCH|STRATEGY|IMAGE|VIDEO"}]}`,
  STRATEGY: "Strategic Lead. Deliver high-stakes business blueprint. Focus on ROI and scaling.",
  INTELLIGENCE: "Intelligence Node. Use Google Search for real-time market data. Ground all claims.",
  CREATION: "Creative Forge. Generate high-end industrial visual assets in Obsidian & Chrome style.",
  NEURAL_MIRROR: "Critique the following output. Suggest 3 tactical improvements for higher impact."
};

const sanitizeJson = (text: string): string => text.replace(/```json/g, '').replace(/```/g, '').trim();

/**
 * Sicherer API-Call mit kontrollierten Retries. 
 * Verhindert UI-Hangs bei Quota-Limits (429).
 */
const callWithRetry = async <T>(fn: () => Promise<T>, retries = 1, delay = 3000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error).toUpperCase();
    const isQuota = errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED');
    
    if (isQuota && retries > 0) {
      console.warn(`[G5_KERNEL] Quota limit detected. Retry 1/1 in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const executeNodeAction = async (
  prompt: string,
  config: DeploymentConfig,
  isPlanning: boolean = false,
  useMirror: boolean = false,
  taskType?: string,
  files?: FileData[]
): Promise<NodeOutput> => {
  const startTime = Date.now();
  const nodeId = config.nodeId;
  const nType = (taskType || '').toUpperCase();
  
  const isVideo = !isPlanning && (nodeId === 'CC-06' || nType === 'VIDEO');
  const isImage = !isPlanning && (nodeId === 'CC-10' || nType === 'IMAGE');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 1. VIDEO PRODUCTION (VEO 3.1)
    if (isVideo) {
      const operation = await callWithRetry(() => ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Industrial cinematic, Obsidian & Chrome style, 4K render: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      }));
      
      let result = operation as any;
      while (!result.done) {
        await new Promise(r => setTimeout(r, 10000));
        result = await ai.operations.getVideosOperation({ operation: result });
      }

      const uri = result.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) throw new Error("VEO_ASSET_STORAGE_FAILED");

      const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const base64 = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.onloadend = () => r(reader.result as string);
        reader.readAsDataURL(blob);
      });

      return {
        nodeId, status: 'success', data: "Video synthesis complete.",
        artifacts: [{ type: 'video', content: base64, label: `${nodeId}_VEO_ASSET`, metadata: { nodeId } }],
        executionTime: Date.now() - startTime
      };
    }

    // 2. IMAGE PRODUCTION (IMAGEN 4)
    if (isImage) {
      const response = await callWithRetry(() => ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Obsidian & Chrome industrial style, high-end photography: ${prompt}`,
        config: { numberOfImages: 1, aspectRatio: '16:9' }
      })) as any;
      
      const base64Image = `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
      return { 
        nodeId, status: 'success', data: "Image production successful.", 
        artifacts: [{ type: 'image', content: base64Image, label: `${nodeId}_IMAGEN_ASSET`, metadata: { nodeId } }], 
        executionTime: Date.now() - startTime 
      };
    }

    // 3. COGNITIVE REASONING (GEMINI 3 PRO)
    const primaryResponse = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { 
        parts: [
          ...(files || []).map(f => ({ inlineData: { data: f.data, mimeType: f.mimeType } })),
          { text: prompt }
        ] 
      },
      config: {
        systemInstruction: CLUSTER_DIRECTIVES[nodeId.split('-')[0]] || CLUSTER_DIRECTIVES.STRATEGY,
        tools: (nodeId.startsWith('RA') && !isPlanning) ? [{ googleSearch: {} }] : undefined,
        responseMimeType: isPlanning ? "application/json" : undefined,
        thinkingConfig: { thinkingBudget: isPlanning ? 4000 : 12000 }
      }
    })) as GenerateContentResponse;

    let finalContent = primaryResponse.text || "";
    const artifacts: Artifact[] = [];
    if (!isPlanning) {
      artifacts.push({ type: nodeId.startsWith('RA') ? 'report' : 'doc', content: finalContent, label: `${nodeId}_DOSSIER`, metadata: { nodeId } });
    }

    return {
      nodeId, status: 'success', data: finalContent,
      grounding: (primaryResponse as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      artifacts,
      plan: isPlanning ? JSON.parse(sanitizeJson(finalContent)).objectives : undefined,
      executionTime: Date.now() - startTime,
      thoughtSignature: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`
    };

  } catch (error: any) {
    console.error(`[G5_ERROR] Node ${nodeId}:`, error.message);
    const isQuota = error.message?.includes('429') || JSON.stringify(error).includes('429');
    return { 
      nodeId, 
      status: 'error', 
      data: isQuota ? "RESOURCE_EXHAUSTED: Google API Quota reached for this model. Skipping task." : error.message, 
      executionTime: 0 
    };
  }
};

export const generateBriefingAudio = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Attention. Strategic Briefing: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
    }
  }) as any;
  return `data:audio/wav;base64,${response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data}`;
};
