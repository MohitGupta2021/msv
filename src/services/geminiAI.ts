import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyChQWSmy4R5ki70-pIUbfPsahviGHAFlLw';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiAIService {
  static async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const enhancedPrompt = context 
        ? `Context: ${context}\n\nUser: ${prompt}\n\nPlease provide a helpful and detailed response based on the context and user's question.`
        : prompt;

      const requestData = {
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await axios.post(
        `${GEMINI_BASE_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const geminiResponse: GeminiResponse = response.data;
      
      if (geminiResponse.candidates && geminiResponse.candidates.length > 0) {
        const candidate = geminiResponse.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text;
        }
      }

      throw new Error('No valid response from Gemini AI');
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 403) {
          throw new Error('API key invalid or quota exceeded.');
        }
      }
      
      throw new Error('Failed to generate AI response');
    }
  }

  static async analyzeTranscription(transcription: string, fileName?: string): Promise<string> {
    const analysisPrompt = fileName 
      ? `I've transcribed the following audio from file "${fileName}": "${transcription}". Please provide a summary and key insights from this transcription.`
      : `Please analyze this transcribed audio: "${transcription}". Provide a summary and any key insights.`;

    return this.generateResponse(analysisPrompt);
  }

  static async generateContextualResponse(userMessage: string, aiMode: string, transcriptionContext?: string): Promise<string> {
    let systemPrompt = '';
    
    switch (aiMode) {
      case 'trained':
        systemPrompt = 'You are a specialized AI with expert domain knowledge. Provide detailed, technical responses based on advanced training data.';
        break;
      case 'realtime':
        systemPrompt = 'You are a real-time AI assistant with access to current information. Provide up-to-date, dynamic responses.';
        break;
      case 'conventional':
        systemPrompt = 'You are a helpful AI assistant. Provide clear, informative responses using general knowledge.';
        break;
    }

    const contextualPrompt = transcriptionContext
      ? `${systemPrompt}\n\nTranscription context: ${transcriptionContext}\n\nUser message: ${userMessage}`
      : `${systemPrompt}\n\nUser message: ${userMessage}`;

    return this.generateResponse(contextualPrompt);
  }
}