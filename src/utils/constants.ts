import { AIMode, SystemStatus } from '../types';

export const AI_MODES: Record<AIMode, {
  name: string;
  color: string;
  bgColor: string;
  description: string;
  icon: string;
}> = {
  trained: {
    name: 'Trained AI',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Specialized domain knowledge',
    icon: 'Brain'
  },
  realtime: {
    name: 'Real-time AI',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Live data processing',
    icon: 'Zap'
  },
  conventional: {
    name: 'Conventional AI',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Standard AI responses',
    icon: 'MessageCircle'
  }
};

export const SUPPORTED_FILE_TYPES = ['.pdf', '.txt', '.doc', '.docx', '.json', '.csv'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as const, password: 'admin123' },
  { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' as const, password: 'user123' }
];

export const INITIAL_SYSTEM_STATUS: SystemStatus = {
  activeModels: 3,
  totalDocuments: 127,
  systemHealth: 'excellent',
  uptime: '7d 14h 32m',
  memoryUsage: 68,
  cpuUsage: 23,
  lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
};

export const HEALTH_COLORS = {
  excellent: 'text-green-600 bg-green-50',
  good: 'text-blue-600 bg-blue-50',
  warning: 'text-yellow-600 bg-yellow-50',
  critical: 'text-red-600 bg-red-50'
};

export const STATUS_COLORS = {
  idle: 'text-gray-600 bg-gray-50',
  uploading: 'text-blue-600 bg-blue-50',
  processing: 'text-yellow-600 bg-yellow-50',
  transmitting: 'text-purple-600 bg-purple-50',
  completed: 'text-green-600 bg-green-50',
  error: 'text-red-600 bg-red-50'
};