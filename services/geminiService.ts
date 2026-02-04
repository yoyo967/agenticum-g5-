
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { DeploymentConfig, NodeOutput, FileData, Artifact, GroundingChunk, StrategicObjective } from "../types";

const CLUSTER_DIRECTIVES: Record<string, string> = {
  APEX: `ACT AS THE CENTRAL ORCHESTRATOR. 
  STRICT OUTPUT RULE: YOU MUST ONLY RESPOND WITH A VALID JSON OBJECT. 
  NO PREAMBLE. NO EXPLANATION. NO MARKDOWN BLOCKS.
  REQUIRED FORMAT: {"objectives": [{"id": "unique_id", "label": "Short Title", "assignedNode": "NODE_ID", "description": "DETAILED_PROMPT", "type": "RESEARCH|STRATEGY|IMAGE|VIDEO"}]}
  NODES TO USE: RA-01 (Intel), SP-01 (Strategy), CC-10 (Image), CC-06 (Video).`,
  STRATEGY: "Strategic Lead. Deliver high-stakes business blueprint. Focus on ROI and scaling.",
  INTELLIGENCE: "Intelligence Node. Use Google Search for real-time market data. Ground all claims.",
  CREATION: "Creative Forge. Generate high-end industrial visual assets in Obsidian & Chrome style.",
  NEURAL_MIRROR: "Critique the following output. Suggest 3 tactical improvements for higher impact."
};

const CLUSTER_MAP: Record<string, string> = {
  SN: 'APEX',
  SP: 'STRATEGY',
  RA: 'INTELLIGENCE',
  CC: 'CREATION',
  MI: 'GOVERNANCE'
};

const sanitizeJson = (text: string): string => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return text.substring(start, end + 1);
  }
  const arrayStart = text.indexOf('[');
  const arrayEnd = text.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd !== -1) {
     return text.substring(arrayStart, arrayEnd + 1);
  }
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

const findArrayInObject = (obj: any): any[] | null => {
  if (Array.isArray(obj)) return obj;
  if (typeof obj !== 'object' || obj === null) return null;
  
  const commonKeys = ['objectives', 'plan', 'tasks', 'steps', 'mission_blueprint'];
  for (const key of commonKeys) {
    if (Array.isArray(obj[key])) return obj[key];
  }

  for (const key in obj) {
    const found = findArrayInObject(obj[key]);
    if (found) return found;
  }
  return null;
};

const callWithRetry = async <T>(fn: () => Promise<T>, retries = 1, delay = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if ((error.message?.includes('429') || JSON.stringify(error).includes('429')) && retries > 0) {
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
  const nodeId = config.nodeId || 'SN-00';
  const clusterPrefix = nodeId.split('-')[0];
  const instructionKey = CLUSTER_MAP[clusterPrefix] || clusterPrefix;
  
  const nType = (taskType || '').toUpperCase();
  const isVideo = !isPlanning && (nodeId === 'CC-06' || nType === 'VIDEO');
  const isImage = !isPlanning && (nodeId === 'CC-10' || nType === 'IMAGE');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (isVideo) {
      const operation = await callWithRetry(() => ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Industrial cinematic, Obsidian & Chrome style: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      }));
      let result = operation as any;
      while (!result.done) {
        await new Promise(r => setTimeout(r, 10000));
        result = await ai.operations.getVideosOperation({ operation: result });
      }
      const uri = result.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const base64 = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.onloadend = () => r(reader.result as string);
        reader.readAsDataURL(blob);
      });
      return { nodeId, status: 'success', data: "Video complete.", artifacts: [{ type: 'video', content: base64, metadata: { nodeId } }], executionTime: Date.now() - startTime };
    }

    if (isImage) {
      const response = await callWithRetry(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High-end industrial key visual, Obsidian & Chrome style, cinematic lighting: ${prompt}` }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      }));
      let base64Image = "";
      for (const part of (response as any).candidates[0].content.parts) {
        if (part.inlineData) base64Image = `data:image/png;base64,${part.inlineData.data}`;
      }
      return { nodeId, status: 'success', data: "Image successful.", artifacts: [{ type: 'image', content: base64Image, metadata: { nodeId } }], executionTime: Date.now() - startTime };
    }

    const thinkingBudget = isPlanning ? 8000 : 16000;
    const maxOutputTokens = isPlanning ? 4000 : 8000;

    const primaryResponse = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [...(files || []).map(f => ({ inlineData: { data: f.data, mimeType: f.mimeType } })), { text: prompt }] },
      config: {
        systemInstruction: CLUSTER_DIRECTIVES[instructionKey] || CLUSTER_DIRECTIVES.STRATEGY,
        tools: (nodeId.startsWith('RA') && !isPlanning) ? [{ googleSearch: {} }] : undefined,
        responseMimeType: isPlanning ? "application/json" : undefined,
        maxOutputTokens: maxOutputTokens + thinkingBudget,
        thinkingConfig: { thinkingBudget }
      }
    })) as GenerateContentResponse;

    let finalContent = primaryResponse.text || "";
    let plan: StrategicObjective[] | undefined = undefined;

    if (isPlanning) {
      const jsonStr = sanitizeJson(finalContent);
      const parsed = JSON.parse(jsonStr);
      const rawList = findArrayInObject(parsed);
      
      if (rawList && Array.isArray(rawList)) {
        plan = rawList.map((item: any, idx: number) => ({
          id: item.id || `task-${idx}`,
          label: item.label || 'Untitled Task',
          assignedNode: item.assignedNode || 'SP-01',
          description: item.description || item.prompt || 'No description provided.',
          type: (item.type || 'STRATEGY').toUpperCase(),
          progress: 0,
          status: 'PENDING'
        }));
      } else {
        throw new Error("PLAN_FORMAT_ERROR: Orchestrator failed to provide a valid task list in JSON.");
      }
    }

    return {
      nodeId, status: 'success', data: finalContent,
      grounding: (primaryResponse as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      artifacts: !isPlanning ? [{ type: nodeId.startsWith('RA') ? 'report' : 'doc', content: finalContent, label: `${nodeId}_DOSSIER`, metadata: { nodeId } }] : [],
      plan,
      executionTime: Date.now() - startTime,
      thoughtSignature: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`
    };

  } catch (error: any) {
    return { nodeId, status: 'error', data: error.message, executionTime: 0 };
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
