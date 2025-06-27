import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Save, RefreshCw } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import SmartToggle from '../../ui/SmartToggle';

export default function SettingsTab() {
  const {
    ttsEnabled,
    voiceInputEnabled,
    darkMode,
    notifications,
    autoBackup,
    toggleTTS,
    toggleVoiceInput,
    toggleDarkMode,
    toggleNotifications,
    toggleAutoBackup,
    exportSettings
  } = useSettings();

  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExportSettings = async () => {
    setIsExporting(true);
    await exportSettings();
    setIsExporting(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const settingsGroups = [
    {
      title: 'User Interface',
      settings: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch to dark theme for better visibility',
          enabled: darkMode,
          toggle: toggleDarkMode
        },
        {
          key: 'notifications',
          label: 'Notifications',
          description: 'Receive system notifications and alerts',
          enabled: notifications,
          toggle: toggleNotifications
        }
      ]
    },
    {
      title: 'Audio & Voice',
      settings: [
        {
          key: 'ttsEnabled',
          label: 'Text-to-Speech',
          description: 'Enable voice output for AI responses',
          enabled: ttsEnabled,
          toggle: toggleTTS
        },
        {
          key: 'voiceInputEnabled',
          label: 'Voice Input',
          description: 'Allow voice commands and dictation',
          enabled: voiceInputEnabled,
          toggle: toggleVoiceInput
        }
      ]
    },
    {
      title: 'System',
      settings: [
        {
          key: 'autoBackup',
          label: 'Automatic Backup',
          description: 'Automatically backup settings and data',
          enabled: autoBackup,
          toggle: toggleAutoBackup
        }
      ]
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your AI chat experience</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportSettings}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{group.title}</h2>
          <div className="space-y-6">
            {group.settings.map((setting, index) => (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
              >
                <SmartToggle
                  enabled={setting.enabled}
                  onChange={setting.toggle}
                  label={setting.label}
                  description={setting.description}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Advanced Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h3 className="font-medium text-gray-900">Import Settings</h3>
              <p className="text-sm text-gray-500">Import settings from a backup file</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h3 className="font-medium text-gray-900">Reset to Defaults</h3>
              <p className="text-sm text-gray-500">Restore all settings to their default values</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Application Version</h3>
            <p className="text-sm text-gray-600">v1.0.0</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Build Number</h3>
            <p className="text-sm text-gray-600">2024.01.15.001</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Environment</h3>
            <p className="text-sm text-gray-600">Production</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}