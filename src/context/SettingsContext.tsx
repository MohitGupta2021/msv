import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Settings } from '../types';

interface SettingsContextType extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  toggleTTS: () => void;
  toggleVoiceInput: () => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleEncryption: () => void;
  toggleAuditLogging: () => void;
  toggleAutoBackup: () => void;
  exportSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  ttsEnabled: false,
  voiceInputEnabled: true,
  darkMode: false,
  notifications: true,
  encryptionEnabled: true,
  auditLogging: true,
  autoBackup: false,
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTTS = () => {
    setSettings(prev => ({ ...prev, ttsEnabled: !prev.ttsEnabled }));
  };

  const toggleVoiceInput = () => {
    setSettings(prev => ({ ...prev, voiceInputEnabled: !prev.voiceInputEnabled }));
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleNotifications = () => {
    setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  const toggleEncryption = () => {
    setSettings(prev => ({ ...prev, encryptionEnabled: !prev.encryptionEnabled }));
  };

  const toggleAuditLogging = () => {
    setSettings(prev => ({ ...prev, auditLogging: !prev.auditLogging }));
  };

  const toggleAutoBackup = () => {
    setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }));
  };

  const exportSettings = async (): Promise<void> => {
    const exportData = {
      settings,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        userAgent: navigator.userAgent,
      },
      // Exclude sensitive data
      sanitized: true,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        updateSettings,
        toggleTTS,
        toggleVoiceInput,
        toggleDarkMode,
        toggleNotifications,
        toggleEncryption,
        toggleAuditLogging,
        toggleAutoBackup,
        exportSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}