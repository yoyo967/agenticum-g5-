
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { DeploymentConfig, NodeOutput, FileData } from "../types";

export const executeNodeAction = async (
  prompt: string,
  config: DeploymentConfig,
  files?: FileData[]
): Promise<NodeOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const startTime = Date.now();
  const nodeId = config.nodeId;

  // Strategic/Research nodes trigger GATES and System 2 Thinking
  const isStrategic = nodeId.startsWith('SP') || nodeId === 'SN-00';
  const isResearch = nodeId.startsWith('RA');
  const isGATESRequired = isStrategic || isResearch;
  
  // Multimodal intent detectors
  const isVideoGen = /video|movie|veo|animate|motion|film/i.test(prompt) || nodeId === 'CC-06';
  const isImageGen = /image|picture|photo|draw|art|illustration/i.test(prompt) || nodeId === 'CC-10';
  const isAudioGen = /speak|audio|voice|tts|say/i.test(prompt) || nodeId === 'CC-12';
  const isMapsRequest = /map|location|nearby|find|restaurant|place|address/i.test(prompt);
  const isSearchRequest = (isResearch || /search|google|news|current|trend/i.test(prompt)) && !isMapsRequest;

  try {
    // 1. VIDEO GENERATION (VEO 3.1)
    if (isVideoGen) {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Industrial cinematic marketing asset: ${prompt}. Precise, authoritative, obsidian and chrome palette.`,
        config: { resolution: '720p', aspectRatio: config.aspectRatio === '9:16' ? '9:16' : '16:9' }
      });
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      return {
        nodeId, status: 'success', executionTime: Date.now() - startTime,
        data: "Temporal synthesis sequence finalized via Veo 3.1 engine.",
        artifacts: [{ type: 'video', content: `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`, metadata: { model: 'veo-3.1-fast-generate-preview' } }]
      };
    }

    // 2. IMAGE GENERATION (Gemini 2.5 Flash Image)
    if (isImageGen) {
      const useImagen = /imagen/i.test(prompt);
      if (useImagen) {
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `Industrial design, chrome textures, obsidian lighting, professional photography: ${prompt}`,
          config: { numberOfImages: 1, aspectRatio: config.aspectRatio === '9:16' ? '9:16' : '1:1' }
        });
        const base64 = response.generatedImages[0].image.imageBytes;
        return {
          nodeId, status: 'success', executionTime: Date.now() - startTime,
          data: "High-fidelity visual asset forged via Imagen 4.0.",
          artifacts: [{ type: 'image', content: `data:image/png;base64,${base64}`, metadata: { model: 'imagen-4.0-generate-001' } }]
        };
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `Generate an industrial architectural marketing visual: ${prompt}. Chrome and obsidian theme.` }] },
          config: { imageConfig: { aspectRatio: config.aspectRatio === '9:16' ? '9:16' : '1:1' } }
        });
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          return {
            nodeId, status: 'success', executionTime: Date.now() - startTime,
            data: "Visual synthesis complete via Gemini 2.5 Flash Image.",
            artifacts: [{ type: 'image', content: `data:image/png;base64,${part.inlineData.data}`, metadata: { model: 'gemini-2.5-flash-image' } }]
          };
        }
      }
    }

    // 3. AUDIO SYNTHESIS (Gemini TTS)
    if (isAudioGen) {
      const audioResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Industrial Protocol Briefing: ${prompt}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });
      const audioData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return {
        nodeId, status: 'success', executionTime: Date.now() - startTime,
        data: "Acoustic signature synthesized.",
        artifacts: [{ type: 'audio', content: audioData || '', metadata: { model: 'gemini-2.5-flash-preview-tts' } }]
      };
    }

    // 4. CORE REASONING & GROUNDING
    const requestedThinking = isStrategic ? 32768 : (config.thinkingBudget || 0);
    const maxTokens = requestedThinking > 0 ? requestedThinking + (config.maxTokens || 4000) : (config.maxTokens || 4000);
    
    // Maps grounding is only supported in Gemini 2.5 series
    const model = isMapsRequest ? 'gemini-2.5-flash-lite-latest' : (isGATESRequired ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview');

    const contents = files ? [
      ...files.map(f => ({ inlineData: { data: f.data, mimeType: f.mimeType } })),
      { text: prompt }
    ] : prompt;

    let latLng = undefined;
    if (isMapsRequest) {
      try {
        const pos: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {
        console.warn("Geolocation fallback to core coordinates.");
        latLng = { latitude: 37.7749, longitude: -122.4194 }; // Default to SF
      }
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: `You are node ${nodeId} of the AGENTICUM G5 OS. Use ultimate precision. Maintain industrial authority. English only. If performing strategic analysis, provide a detailed reasoning trace before the final directive.`,
        thinkingConfig: requestedThinking > 0 && !isMapsRequest ? { thinkingBudget: requestedThinking } : undefined,
        maxOutputTokens: maxTokens,
        tools: isSearchRequest ? [{ googleSearch: {} }] : isMapsRequest ? [{ googleMaps: {} }] : undefined,
        toolConfig: isMapsRequest ? { retrievalConfig: { latLng } } : undefined,
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => {
        if (chunk.maps) return { maps: { uri: chunk.maps.uri, title: chunk.maps.title || "GEO_TARGET" } };
        if (chunk.web) return { web: { uri: chunk.web.uri, title: chunk.web.title } };
        return chunk;
    });

    return {
      nodeId,
      status: 'success',
      data: response.text,
      grounding: groundingChunks,
      reasoning: isStrategic ? `Strategic Thinking cycle engaged (${requestedThinking} tokens).` : undefined,
      executionTime: Date.now() - startTime
    };

  } catch (error: any) {
    console.error("G5_System_Fault:", error);
    return {
      nodeId, status: 'error', executionTime: Date.now() - startTime,
      data: `FAULT_ID_${(Date.now() % 0xFFFF).toString(16).toUpperCase()}: ${error.message || 'Logical exception in neural fabric.'}`
    };
  }
};
