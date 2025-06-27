import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSettings } from '../../context/SettingsContext';
import { GeminiAIService } from '../../services/geminiAI';
import { SUPPORTED_FILE_TYPES } from '../../utils/constants';
import VoiceRecorder from './VoiceRecorder';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, currentAIMode, setLoading, isLoading } = useApp();
  const { voiceInputEnabled } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateAIResponse = async (userMessage: string, aiMode: typeof currentAIMode, transcriptionContext?: string): Promise<string> => {
    try {
      // Use Gemini AI for more sophisticated responses
      return await GeminiAIService.generateContextualResponse(userMessage, aiMode, transcriptionContext);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback to mock responses if Gemini fails
      const fallbackResponses = {
        trained: [
          `Based on my specialized training, I can provide detailed insights about "${userMessage.slice(0, 30)}...". Let me analyze this with domain-specific knowledge.`,
          `Drawing from my expert knowledge base, here's a comprehensive analysis of your query about "${userMessage.slice(0, 25)}...".`,
        ],
        realtime: [
          `🔴 LIVE: Processing your request "${userMessage.slice(0, 25)}..." with real-time data streams and current information.`,
          `⚡ Real-time analysis: Your question connects to recent developments and trending information.`,
        ],
        conventional: [
          `I understand you're asking about "${userMessage.slice(0, 30)}...". Here's a helpful response based on general knowledge.`,
          `Thank you for your question. Let me provide a standard response that addresses your inquiry.`,
        ]
      };

      const modeResponses = fallbackResponses[aiMode];
      return modeResponses[Math.floor(Math.random() * modeResponses.length)];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      content: userMessage,
      sender: 'user'
    });

    setLoading(true);

    try {
      // Generate AI response using Gemini
      const aiResponse = await generateAIResponse(userMessage, currentAIMode);

      // Add AI response
      addMessage({
        content: aiResponse,
        sender: 'ai',
        aiMode: currentAIMode
      });
    } catch (error) {
      console.error('Error in chat:', error);
      addMessage({
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        sender: 'ai',
        aiMode: currentAIMode
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTranscriptionComplete = async (transcription: string) => {
    if (!transcription.trim()) return;

    // Set the transcription as input
    setInput(transcription);

    // Optionally auto-submit the transcription
    // Uncomment the following lines if you want auto-submission
    /*
    addMessage({
      content: transcription,
      sender: 'user'
    });

    setLoading(true);

    try {
      const aiResponse = await generateAIResponse(transcription, currentAIMode, 'This message was transcribed from audio');
      
      addMessage({
        content: aiResponse,
        sender: 'ai',
        aiMode: currentAIMode
      });
    } catch (error) {
      console.error('Error processing transcription:', error);
      addMessage({
        content: 'I received your transcribed message but encountered an error processing it. Please try again.',
        sender: 'ai',
        aiMode: currentAIMode
      });
    } finally {
      setLoading(false);
    }
    */
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (SUPPORTED_FILE_TYPES.includes(fileExtension)) {
        addMessage({
          content: `I've uploaded a file for analysis: ${file.name}`,
          sender: 'user',
          fileName: file.name,
          fileType: file.type
        });
        
        // Simulate file processing with Gemini AI
        setTimeout(async () => {
          try {
            const analysisResponse = await GeminiAIService.generateResponse(
              `I've received a file named "${file.name}" of type "${file.type}". Please provide insights about what I can help the user with regarding this document and ask what specific questions they have about it.`
            );
            
            addMessage({
              content: analysisResponse,
              sender: 'ai',
              aiMode: currentAIMode
            });
          } catch (error) {
            addMessage({
              content: `I've received your file "${file.name}". I can help analyze documents, answer questions about content, and provide insights. What would you like to know about this file?`,
              sender: 'ai',
              aiMode: currentAIMode
            });
          }
        }, 2000);
      } else {
        alert(`Unsupported file type. Please upload: ${SUPPORTED_FILE_TYPES.join(', ')}`);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "AI is thinking..." : "Type your message or use voice input..."}
            disabled={isLoading}
            className="w-full px-4 py-3 pr-32 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <input
              ref={fileInputRef}
              type="file"
              accept={SUPPORTED_FILE_TYPES.join(',')}
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
              title="Upload File"
            >
              <Upload className="w-4 h-4" />
            </motion.button>

            {voiceInputEnabled && (
              <VoiceRecorder 
                onTranscriptionComplete={handleTranscriptionComplete}
                disabled={isLoading}
              />
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </form>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Enhanced with AssemblyAI Speech-to-Text & Google Gemini AI • Current Mode: 
        <span className="font-medium text-blue-600 ml-1">
          {currentAIMode.charAt(0).toUpperCase() + currentAIMode.slice(1)} AI
        </span>
      </div>
    </div>
  );
}