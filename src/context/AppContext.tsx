import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User, Message, AIMode, UploadedFile, POLFData } from '../types';
import { INITIAL_SYSTEM_STATUS } from '../utils/constants';

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setAIMode: (mode: AIMode) => void;
  setLoading: (loading: boolean) => void;
  setVoiceInputActive: (active: boolean) => void;
  addUploadedFile: (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => void;
  updateFileProgress: (id: string, progress: number, status?: UploadedFile['status']) => void;
  removeUploadedFile: (id: string) => void;
  addPOLFData: (data: Omit<POLFData, 'id' | 'createdAt' | 'lastModified'>) => void;
  updatePOLFProgress: (id: string, progress: number, status?: POLFData['status']) => void;
  removePOLFData: (id: string) => void;
  updateSystemStatus: (status: Partial<AppState['systemStatus']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_AI_MODE'; payload: AIMode }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_VOICE_INPUT_ACTIVE'; payload: boolean }
  | { type: 'ADD_UPLOADED_FILE'; payload: Omit<UploadedFile, 'id' | 'uploadedAt'> }
  | { type: 'UPDATE_FILE_PROGRESS'; payload: { id: string; progress: number; status?: UploadedFile['status'] } }
  | { type: 'REMOVE_UPLOADED_FILE'; payload: string }
  | { type: 'ADD_POLF_DATA'; payload: Omit<POLFData, 'id' | 'createdAt' | 'lastModified'> }
  | { type: 'UPDATE_POLF_PROGRESS'; payload: { id: string; progress: number; status?: POLFData['status'] } }
  | { type: 'REMOVE_POLF_DATA'; payload: string }
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<AppState['systemStatus']> };

const initialState: AppState = {
  user: null,
  messages: [],
  currentAIMode: 'trained',
  isLoading: false,
  isVoiceInputActive: false,
  uploadedFiles: [],
  systemStatus: INITIAL_SYSTEM_STATUS,
  polfData: [
    {
      id: '1',
      name: 'GPT-4 Model Configuration',
      type: 'model',
      size: 1024000000,
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { version: '4.0', accuracy: 0.95 }
    },
    {
      id: '2',
      name: 'Training Dataset Alpha',
      type: 'dataset',
      size: 512000000,
      status: 'idle',
      progress: 0,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000),
      metadata: { samples: 50000, quality: 'high' }
    }
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date(),
          },
        ],
      };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_AI_MODE':
      return { ...state, currentAIMode: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_VOICE_INPUT_ACTIVE':
      return { ...state, isVoiceInputActive: action.payload };
    case 'ADD_UPLOADED_FILE':
      return {
        ...state,
        uploadedFiles: [
          ...state.uploadedFiles,
          {
            ...action.payload,
            id: Date.now().toString(),
            uploadedAt: new Date(),
          },
        ],
      };
    case 'UPDATE_FILE_PROGRESS':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.map(file =>
          file.id === action.payload.id
            ? { 
                ...file, 
                progress: action.payload.progress,
                status: action.payload.status || file.status,
                processedAt: action.payload.status === 'completed' ? new Date() : file.processedAt
              }
            : file
        ),
      };
    case 'REMOVE_UPLOADED_FILE':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(file => file.id !== action.payload),
      };
    case 'ADD_POLF_DATA':
      return {
        ...state,
        polfData: [
          ...state.polfData,
          {
            ...action.payload,
            id: Date.now().toString(),
            createdAt: new Date(),
            lastModified: new Date(),
          },
        ],
      };
    case 'UPDATE_POLF_PROGRESS':
      return {
        ...state,
        polfData: state.polfData.map(data =>
          data.id === action.payload.id
            ? { 
                ...data, 
                progress: action.payload.progress,
                status: action.payload.status || data.status,
                lastModified: new Date()
              }
            : data
        ),
      };
    case 'REMOVE_POLF_DATA':
      return {
        ...state,
        polfData: state.polfData.filter(data => data.id !== action.payload),
      };
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: { ...state.systemStatus, ...action.payload },
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (user: User) => dispatch({ type: 'LOGIN', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) =>
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  const clearMessages = () => dispatch({ type: 'CLEAR_MESSAGES' });
  const setAIMode = (mode: AIMode) => dispatch({ type: 'SET_AI_MODE', payload: mode });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setVoiceInputActive = (active: boolean) =>
    dispatch({ type: 'SET_VOICE_INPUT_ACTIVE', payload: active });
  const addUploadedFile = (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) =>
    dispatch({ type: 'ADD_UPLOADED_FILE', payload: file });
  const updateFileProgress = (id: string, progress: number, status?: UploadedFile['status']) =>
    dispatch({ type: 'UPDATE_FILE_PROGRESS', payload: { id, progress, status } });
  const removeUploadedFile = (id: string) =>
    dispatch({ type: 'REMOVE_UPLOADED_FILE', payload: id });
  const addPOLFData = (data: Omit<POLFData, 'id' | 'createdAt' | 'lastModified'>) =>
    dispatch({ type: 'ADD_POLF_DATA', payload: data });
  const updatePOLFProgress = (id: string, progress: number, status?: POLFData['status']) =>
    dispatch({ type: 'UPDATE_POLF_PROGRESS', payload: { id, progress, status } });
  const removePOLFData = (id: string) =>
    dispatch({ type: 'REMOVE_POLF_DATA', payload: id });
  const updateSystemStatus = (status: Partial<AppState['systemStatus']>) =>
    dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: status });

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addMessage,
        clearMessages,
        setAIMode,
        setLoading,
        setVoiceInputActive,
        addUploadedFile,
        updateFileProgress,
        removeUploadedFile,
        addPOLFData,
        updatePOLFProgress,
        removePOLFData,
        updateSystemStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}