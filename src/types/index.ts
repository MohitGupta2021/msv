export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiMode?: AIMode;
  fileName?: string;
  fileType?: string;
}

export type AIMode = 'trained' | 'realtime' | 'conventional';

export interface AppState {
  user: User | null;
  messages: Message[];
  currentAIMode: AIMode;
  isLoading: boolean;
  isVoiceInputActive: boolean;
  uploadedFiles: UploadedFile[];
  systemStatus: SystemStatus;
  polfData: POLFData[];
}

export interface Settings {
  ttsEnabled: boolean;
  voiceInputEnabled: boolean;
  darkMode: boolean;
  notifications: boolean;
  encryptionEnabled: boolean;
  auditLogging: boolean;
  autoBackup: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  uploadedAt: Date;
  processedAt?: Date;
  preview?: string;
}

export interface SystemStatus {
  activeModels: number;
  totalDocuments: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
  lastBackup?: Date;
}

export interface POLFData {
  id: string;
  name: string;
  type: 'model' | 'dataset' | 'config';
  size: number;
  status: 'idle' | 'transmitting' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
  lastModified: Date;
  metadata: Record<string, any>;
}

export type TabType = 'overview' | 'models' | 'documents' | 'settings' | 'security' | 'polf';