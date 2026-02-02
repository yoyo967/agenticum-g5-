
import { GoogleGenAI, Modality } from "@google/genai";
import { DeploymentConfig, NodeOutput, FileData } from "../types";

export const executeNodeAction = async (
  prompt: string,
  config: DeploymentConfig,
  files?: FileData[]
): Promise<NodeOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const startTime = Date.now();

  const nodeId = config.nodeId;
  const isCreation = nodeId.startsWith('CC');
  const isResearch = nodeId.startsWith('RA');
  
  // Specific intent detection
  const isVideoGen = /video|movie|film|animate|veo|sequence|motion/i.test(prompt) || nodeId === 'CC-06';
  const isImageGenOrEdit = /image|picture|photo|draw|art|filter|edit|remove|visual|graphics/i.test(prompt) || nodeId === 'CC-10';
  const isAudioGen = /speak|audio|tts|voice|say|talk/i.test(prompt) || nodeId === 'CC-12';
  const isMapsRequest = /map|location|nearby|restaurant|address|find|place|directions/i.test(prompt);
  const isSearchRequest = (isResearch || /search|google|current|news|latest|who is|status of/i.test(prompt)) && !isMapsRequest;
  const isVideoUnderstanding = files?.some(f => f.mimeType.startsWith('video/'));
  const isImageUnderstanding = files?.some(f => f.mimeType.startsWith('image/')) && !isImageGenOrEdit;

  try {
    // 1. VIDEO GENERATION (VEO 3.1 FAST)
    if (isVideoGen) {
      const veoParams: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: config.aspectRatio === '9:16' ? '9:16' : '16:9'
        }
      };

      const referenceImage = files?.find(f => f.mimeType.startsWith('image/'));
      if (referenceImage) {
        veoParams.image = {
          imageBytes: referenceImage.data,
          mimeType: referenceImage.mimeType
        };
      }

      let operation = await ai.models.generateVideos(veoParams);
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      return {
        nodeId,
        status: 'success',
        data: "Temporal synthesis sequence finalized. Asset buffer updated.",
        artifacts: [{
          type: 'video',
          content: `${videoUri}&key=${process.env.API_KEY}`,
          metadata: { model: 'veo-3.1-fast-generate-preview' }
        }],
        executionTime: Date.now() - startTime
      };
    }

    // 2. IMAGE GENERATION / EDITING
    if (isImageGenOrEdit) {
      const imageFiles = files?.filter(f => f.mimeType.startsWith('image/')) || [];
      const isEditing = imageFiles.length > 0 || /edit|filter|remove|change|add/i.test(prompt);
      
      if (isEditing) {
        const parts: any[] = imageFiles.map(f => ({
          inlineData: { data: f.data, mimeType: f.mimeType }
        }));
        parts.push({ text: prompt });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts }
        });

        let imageUrl = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }

        return {
          nodeId,
          status: 'success',
          data: "Neural visual modification cycle complete.",
          artifacts: [{ type: 'image', content: imageUrl, metadata: { model: 'gemini-2.5-flash-image' } }],
          executionTime: Date.now() - startTime
        };
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: {
              aspectRatio: (config.aspectRatio as any) || "1:1",
              imageSize: config.imageSize || "1K"
            }
          }
        });

        let imageUrl = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }

        return {
          nodeId,
          status: 'success',
          data: `Synthetic asset generation confirmed. Configuration: [Ratio: ${config.aspectRatio}, Scale: ${config.imageSize}].`,
          artifacts: [{ type: 'image', content: imageUrl, metadata: { model: 'gemini-3-pro-image-preview' } }],
          executionTime: Date.now() - startTime
        };
      }
    }

    // 3. SPEECH GENERATION (TTS)
    if (isAudioGen) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return {
        nodeId,
        status: 'success',
        data: "Acoustic synthesis complete. Audio stream ready.",
        artifacts: [{ type: 'audio', content: `data:audio/pcm;base64,${base64Audio}`, metadata: { model: 'gemini-2.5-flash-preview-tts' } }],
        executionTime: Date.now() - startTime
      };
    }

    // 4. MAPS GROUNDING
    if (isMapsRequest) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [{ googleMaps: {} }] }
      });

      return {
        nodeId,
        status: 'success',
        data: response.text,
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        reasoning: "Spatial data retrieval via Google Maps integration.",
        executionTime: Date.now() - startTime
      };
    }

    // 5. SEARCH GROUNDING
    if (isSearchRequest) {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      return {
        nodeId,
        status: 'success',
        data: response.text,
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        reasoning: "External knowledge scan via Google Search grounding.",
        executionTime: Date.now() - startTime
      };
    }

    // 6. MULTIMODAL UNDERSTANDING
    if (isVideoUnderstanding || isImageUnderstanding) {
      const parts: any[] = [];
      files?.forEach(f => parts.push({ inlineData: { data: f.data, mimeType: f.mimeType } }));
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
            thinkingConfig: config.thinkingBudget > 0 ? { thinkingBudget: config.thinkingBudget } : undefined
        }
      });

      return {
        nodeId,
        status: 'success',
        data: response.text,
        reasoning: "Complex multimodal feature extraction complete.",
        executionTime: Date.now() - startTime
      };
    }

    // 7. GENERAL REASONING & FAST AI
    const isFast = /fast|quick|lite|check/i.test(prompt) || nodeId.startsWith('MI');
    const model = isFast ? 'gemini-2.5-flash-lite' : 'gemini-3-pro-preview';
    
    const parts: any[] = [];
    if (files && files.length > 0) {
      files.forEach(f => parts.push({ inlineData: { data: f.data, mimeType: f.mimeType } }));
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        thinkingConfig: (!isFast && config.thinkingBudget > 0) ? { thinkingBudget: config.thinkingBudget } : undefined,
        maxOutputTokens: (!isFast && config.thinkingBudget > 0) ? undefined : config.maxTokens
      }
    });

    return {
      nodeId,
      status: 'success',
      data: response.text,
      reasoning: !isFast && config.thinkingBudget > 0 ? `High-precision reasoning engaged (${config.thinkingBudget}t budget).` : `Synthesized via low-latency ${model}.`,
      executionTime: Date.now() - startTime
    };

  } catch (error: any) {
    console.error(`Fault in Node ${nodeId}:`, error);
    return {
      nodeId,
      status: 'error',
      data: `COGNITIVE_FAULT_0x88: ${error.message || 'Logic deadlock encountered.'}`,
      executionTime: Date.now() - startTime
    };
  }
};
