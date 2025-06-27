import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AI_MODES } from '../../utils/constants';
import { AIMode } from '../../types';

const iconMap = {
  Brain,
  Zap,
  MessageCircle,
};

export default function AIInteraction() {
  const { currentAIMode, setAIMode, user } = useApp();

  const handleModeChange = (mode: AIMode) => {
    if (user?.role === 'admin' || mode === 'conventional') {
      setAIMode(mode);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">AI Mode:</span>
      <div className="flex space-x-2">
        {Object.entries(AI_MODES).map(([mode, config]) => {
          const Icon = iconMap[config.icon as keyof typeof iconMap];
          const isDisabled = user?.role !== 'admin' && mode !== 'conventional';
          const isActive = currentAIMode === mode;
          
          return (
            <motion.button
              key={mode}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => handleModeChange(mode as AIMode)}
              disabled={isDisabled}
              className={`
                px-3 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200
                ${isActive 
                  ? `${config.color} ${config.bgColor} shadow-sm` 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{config.name}</span>
              {isDisabled && user?.role !== 'admin' && (
                <span className="text-xs bg-gray-300 text-gray-600 px-1 rounded">Admin</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}