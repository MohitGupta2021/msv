import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Settings, LogOut, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSettings } from '../../context/SettingsContext';
import AIInteraction from './AIInteraction';

export default function ChatHeader() {
  const { user, logout, clearMessages, messages } = useApp();
  const { toggleTTS, toggleVoiceInput, ttsEnabled, voiceInputEnabled } = useSettings();

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearMessages}
            disabled={messages.length === 0}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={toggleTTS}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                ttsEnabled 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              TTS
            </button>
            <button
              onClick={toggleVoiceInput}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                voiceInputEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Voice
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <AIInteraction />
    </div>
  );
}