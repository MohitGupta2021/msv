import React from 'react';
import { motion } from 'framer-motion';
import { STATUS_COLORS, HEALTH_COLORS } from '../../utils/constants';

interface StatusBadgeProps {
  status: keyof typeof STATUS_COLORS | keyof typeof HEALTH_COLORS;
  children: React.ReactNode;
  pulse?: boolean;
}

export default function StatusBadge({ status, children, pulse = false }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 
                    HEALTH_COLORS[status as keyof typeof HEALTH_COLORS] || 
                    'text-gray-600 bg-gray-50';

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${
        pulse ? 'animate-pulse' : ''
      }`}
    >
      {children}
    </motion.span>
  );
}