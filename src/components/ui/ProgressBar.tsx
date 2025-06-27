import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'transmitting' | 'completed' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

const statusColors = {
  idle: 'bg-gray-200',
  uploading: 'bg-blue-500',
  processing: 'bg-yellow-500',
  transmitting: 'bg-purple-500',
  completed: 'bg-green-500',
  error: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({ 
  progress, 
  status, 
  size = 'md', 
  showPercentage = false 
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full ${statusColors[status]} transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500 capitalize">{status}</span>
          <span className="text-xs font-medium text-gray-700">{progress}%</span>
        </div>
      )}
    </div>
  );
}