import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Settings, 
  FileText, 
  Brain, 
  Shield, 
  Database,
  Activity,
  Users,
  Server
} from 'lucide-react';
import { TabType } from '../../types';
import OverviewTab from './tabs/OverviewTab';
import ModelsTab from './tabs/ModelsTab';
import DocumentsTab from './tabs/DocumentsTab';
import SettingsTab from './tabs/SettingsTab';
import SecurityTab from './tabs/SecurityTab';
import POLFTab from './tabs/POLFTab';

const tabs = [
  { id: 'overview' as TabType, name: 'Overview', icon: BarChart3, color: 'text-blue-600' },
  { id: 'models' as TabType, name: 'AI Models', icon: Brain, color: 'text-purple-600' },
  { id: 'documents' as TabType, name: 'Documents', icon: FileText, color: 'text-green-600' },
  { id: 'polf' as TabType, name: 'POLF Data', icon: Database, color: 'text-orange-600' },
  { id: 'security' as TabType, name: 'Security', icon: Shield, color: 'text-red-600' },
  { id: 'settings' as TabType, name: 'Settings', icon: Settings, color: 'text-gray-600' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'models':
        return <ModelsTab />;
      case 'documents':
        return <DocumentsTab />;
      case 'polf':
        return <POLFTab />;
      case 'security':
        return <SecurityTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-500">System Management</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-gray-400'}`} />
                <span className="font-medium">{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full overflow-y-auto"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}