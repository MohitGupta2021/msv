import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Volume2, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSettings } from '../../context/SettingsContext';
import { AI_MODES } from '../../utils/constants';

export default function ChatMessages() {
  const { messages } = useApp();
  const { ttsEnabled } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : message.aiMode 
                      ? AI_MODES[message.aiMode].bgColor 
                      : 'bg-gray-100'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className={`w-4 h-4 ${
                      message.aiMode ? AI_MODES[message.aiMode].color : 'text-gray-600'
                    }`} />
                  )}
                </div>
              </div>

              <div className={`rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.fileName && (
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-200">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">{message.fileName}</span>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.sender === 'ai' && message.aiMode && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <span className={`text-xs px-2 py-1 rounded-full ${AI_MODES[message.aiMode].bgColor} ${AI_MODES[message.aiMode].color}`}>
                      {AI_MODES[message.aiMode].name}
                    </span>
                    {ttsEnabled && (
                      <button
                        onClick={() => handleSpeak(message.content)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Speak"
                      >
                        <Volume2 className="w-3 h-3 text-gray-600" />
                      </button>
                    )}
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Welcome to AI Chat</p>
            <p className="text-gray-400 text-sm">Start a conversation to see AI responses</p>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}