import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Eye, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import SmartToggle from '../../ui/SmartToggle';
import StatusBadge from '../../ui/StatusBadge';

export default function SecurityTab() {
  const { 
    encryptionEnabled, 
    auditLogging, 
    toggleEncryption, 
    toggleAuditLogging 
  } = useSettings();
  
  const [isExporting, setIsExporting] = useState(false);

  const securityMetrics = [
    {
      name: 'Encryption Status',
      status: encryptionEnabled ? 'Active' : 'Inactive',
      icon: Lock,
      color: encryptionEnabled ? 'completed' : 'error'
    },
    {
      name: 'Audit Logging',
      status: auditLogging ? 'Enabled' : 'Disabled',
      icon: Eye,
      color: auditLogging ? 'completed' : 'warning'
    },
    {
      name: 'Last Security Scan',
      status: '2 hours ago',
      icon: Shield,
      color: 'completed'
    },
    {
      name: 'Failed Login Attempts',
      status: '0 today',
      icon: AlertTriangle,
      color: 'completed'
    }
  ];

  const auditLogs = [
    {
      id: '1',
      action: 'User login',
      user: 'admin@example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: '2',
      action: 'Settings updated',
      user: 'admin@example.com',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: '3',
      action: 'File uploaded',
      user: 'user@example.com',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success',
      ip: '192.168.1.101'
    },
    {
      id: '4',
      action: 'Failed login attempt',
      user: 'unknown@example.com',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'warning',
      ip: '192.168.1.200'
    }
  ];

  const exportAuditLogs = async () => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportData = {
      auditLogs,
      exportedAt: new Date().toISOString(),
      totalRecords: auditLogs.length,
      metadata: {
        version: '1.0.0',
        format: 'JSON'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security & Compliance</h1>
        <p className="text-gray-600">Manage security settings and monitor system access</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <StatusBadge status={metric.color}>
                  {metric.status}
                </StatusBadge>
              </div>
              <h3 className="font-semibold text-gray-900">{metric.name}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
        <div className="space-y-6">
          <SmartToggle
            enabled={encryptionEnabled}
            onChange={toggleEncryption}
            label="End-to-End Encryption"
            description="Encrypt all data transmissions and storage"
          />
          
          <SmartToggle
            enabled={auditLogging}
            onChange={toggleAuditLogging}
            label="Audit Logging"
            description="Log all user actions and system events"
          />
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Configure
              </motion.button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">API Key Management</h3>
                <p className="text-sm text-gray-500">Manage API keys and access tokens</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Manage Keys
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAuditLogs}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export Logs'}</span>
          </motion.button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {auditLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-green-500' :
                    log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={log.status === 'success' ? 'completed' : 'warning'}>
                  {log.status}
                </StatusBadge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}