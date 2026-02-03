
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { DeploymentConfig, NodeOutput, FileData, Artifact, GroundingChunk } from "../types";

const withTimeout = <T>(promise: Promise<T>, ms: number, timeoutError = "NODE_TIMEOUT"): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(timeoutError)), ms))
  ]);
};

const generateThoughtSignature = () => {
  const chars = '0123456789ABCDEF';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

function createWavHeader(pcmData: Uint8Array, sampleRate: number = 24000): Uint8Array {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, pcmData.length, true);
  const result = new Uint8Array(buffer);
  result.set(pcmData, 44);
  return result;
}

function decodeBase64(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  } catch (e) { return new Uint8Array(); }
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export const executeNodeAction = async (
  prompt: string,
  config: DeploymentConfig,
  files?: FileData[],
  context?: string
): Promise<NodeOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const startTime = Date.now();
  const nodeId = config.nodeId;

  const isOrchestrator = nodeId === 'SN-00';
  const isIntelligence = nodeId === 'RA-01';
  const isImageGen = nodeId === 'CC-10' || nodeId === 'CC-06' || /image|visual|design/i.test(prompt);
  const isAudioGen = nodeId === 'CC-12' || /audio|voice|briefing/i.test(prompt);

  try {
    if (isOrchestrator && !context) {
      const orchestratorResponse: GenerateContentResponse = await withTimeout(ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts: [{ text: `SYSTEM_ORCHESTRATOR: Request: "${prompt}". Create a 6-node marketing plan. Output valid JSON array ONLY.` }] }],
        config: { 
          responseMimeType: "application/json", 
          responseSchema: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                id: { type: Type.STRING }, 
                label: { type: Type.STRING }, 
                assignedNode: { type: Type.STRING }, 
                description: { type: Type.STRING } 
              }, 
              required: ["id", "label", "assignedNode", "description"] 
            } 
          } 
        }
      }), 40000); 
      
      return { nodeId, status: 'success', executionTime: Date.now() - startTime, data: `Matrix Established.`, plan: JSON.parse(orchestratorResponse.text || "[]"), thoughtSignature: generateThoughtSignature() };
    }

    const artifacts: Artifact[] = [];
    let grounding: GroundingChunk[] = [];

    // INTELLIGENCE WITH SEARCH GROUNDING
    if (isIntelligence) {
      const searchResponse: GenerateContentResponse = await withTimeout(ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `Perform deep market analysis for: ${prompt}. Ground all facts in current web data.` }] }],
        config: { tools: [{ googleSearch: {} }] }
      }), 45000);
      
      const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      grounding = chunks.map(c => ({ web: c.web }));
      artifacts.push({ type: 'report', content: searchResponse.text || '', label: 'MARKET_INTELLIGENCE_REPORT', metadata: { nodeId } });
    }

    // IMAGE GENERATION
    if (isImageGen) {
      try {
        const imgResponse: GenerateContentResponse = await withTimeout(ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: `Professional industrial marketing visual, obsidian/chrome: ${prompt}` }] },
          config: { imageConfig: { aspectRatio: '16:9', imageSize: '1K' } }
        }), 50000);

        const imgPart = imgResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imgPart?.inlineData) {
          artifacts.push({ type: 'image', content: `data:image/png;base64,${imgPart.inlineData.data}`, label: 'KEY_VISUAL_ASSET', metadata: { nodeId } });
        }
      } catch (err: any) {
        if (err.message?.includes("400") || err.message?.includes("key")) return { nodeId, status: 'error', executionTime: Date.now() - startTime, data: "AUTH_REQUIRED" };
      }
    }

    // AUDIO (TTS)
    if (isAudioGen) {
      try {
        const audioResponse: GenerateContentResponse = await withTimeout(ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: `Acoustic Briefing: ${prompt}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          },
        }), 20000);
        const rawPcm = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (rawPcm) {
          const wavData = createWavHeader(decodeBase64(rawPcm));
          artifacts.push({ type: 'audio', content: `data:audio/wav;base64,${encodeBase64(wavData)}`, label: 'ACOUSTIC_BRIEFING', metadata: { nodeId } });
        }
      } catch (err) {}
    }

    // TEXT DEFAULT
    if (artifacts.length === 0 && !isOrchestrator) {
      const textResponse: GenerateContentResponse = await withTimeout(ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: { systemInstruction: `Agent ${nodeId}. Technical marketing context.` }
      }), 30000);
      artifacts.push({ type: 'report', content: textResponse.text || '', label: `${nodeId}_INTELLIGENCE`, metadata: { nodeId } });
    }

    return { nodeId, status: 'success', executionTime: Date.now() - startTime, data: `Cycle complete.`, artifacts, grounding, thoughtSignature: generateThoughtSignature() };

  } catch (error: any) {
    if (error.message === "NODE_TIMEOUT") return { nodeId, status: 'error', executionTime: Date.now() - startTime, data: "LATENCY_OVERFLOW" };
    if (error.message?.includes("400")) return { nodeId, status: 'error', executionTime: Date.now() - startTime, data: "AUTH_REQUIRED" };
    return { nodeId, status: 'error', executionTime: Date.now() - startTime, data: error.message };
  }
};
