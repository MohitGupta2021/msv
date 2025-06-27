import React from 'react';
import { motion } from 'framer-motion';

interface SmartToggleProps {
  enabled: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SmartToggle({ 
  enabled, 
  onChange, 
  label, 
  description, 
  disabled = false,
  size = 'md'
}: SmartToggleProps) {
  const sizeClasses = {
    sm: { toggle: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { toggle: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { toggle: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex ${classes.toggle} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <motion.span
          className={`inline-block ${classes.thumb} rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out`}
          animate={{
            x: enabled ? classes.translate.replace('translate-x-', '') : '0'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}