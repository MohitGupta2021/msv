import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Pause,
  Plus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import ProgressBar from '../../ui/ProgressBar';
import StatusBadge from '../../ui/StatusBadge';
import Modal from '../../ui/Modal';

export default function POLFTab() {
  const { polfData, addPOLFData, updatePOLFProgress, removePOLFData } = useApp();
  const [isTransmitting, setIsTransmitting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDataForm, setNewDataForm] = useState({
    name: '',
    type: 'model' as 'model' | 'dataset' | 'config',
    size: 0,
    metadata: {}
  });

  const startTransmission = async (id: string) => {
    setIsTransmitting(id);
    updatePOLFProgress(id, 0, 'transmitting');
    
    // Simulate transmission progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        updatePOLFProgress(id, progress, 'completed');
        setIsTransmitting(null);
        clearInterval(interval);
      } else {
        updatePOLFProgress(id, progress);
      }
    }, 300);
  };

  const handleAddData = () => {
    addPOLFData({
      ...newDataForm,
      status: 'idle',
      progress: 0,
      metadata: { ...newDataForm.metadata, version: '1.0' }
    });
    setNewDataForm({ name: '', type: 'model', size: 0, metadata: {} });
    setIsModalOpen(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'model': return '🧠';
      case 'dataset': return '📊';
      case 'config': return '⚙️';
      default: return '📄';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">POLF Data Management</h1>
          <p className="text-gray-600">Advanced data transmission and synchronization</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Sync All</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add POLF Data</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Datasets', value: polfData.length, color: 'blue' },
          { label: 'Active Transmissions', value: polfData.filter(d => d.status === 'transmitting').length, color: 'purple' },
          { label: 'Completed', value: polfData.filter(d => d.status === 'completed').length, color: 'green' },
          { label: 'Total Size', value: formatBytes(polfData.reduce((acc, d) => acc + d.size, 0)), color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                <Database className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* POLF Data List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">POLF Datasets</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {polfData.map((data, index) => (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl">
                    {getTypeIcon(data.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{data.name}</h3>
                      <StatusBadge 
                        status={data.status} 
                        pulse={data.status === 'transmitting'}
                      >
                        {data.status}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Type: {data.type}</span>
                      <span>Size: {formatBytes(data.size)}</span>
                      <span>Modified: {data.lastModified.toLocaleDateString()}</span>
                    </div>
                    {data.status === 'transmitting' && (
                      <div className="mt-3">
                        <ProgressBar 
                          progress={data.progress} 
                          status={data.status}
                          showPercentage
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {data.status === 'idle' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startTransmission(data.id)}
                      disabled={isTransmitting !== null}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" />
                      <span>Transmit</span>
                    </motion.button>
                  )}
                  
                  {data.status === 'transmitting' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removePOLFData(data.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {polfData.length === 0 && (
            <div className="p-12 text-center">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No POLF data found</p>
              <p className="text-gray-400">Add your first dataset to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Data Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New POLF Data"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={newDataForm.name}
              onChange={(e) => setNewDataForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter dataset name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={newDataForm.type}
              onChange={(e) => setNewDataForm(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="model">Model</option>
              <option value="dataset">Dataset</option>
              <option value="config">Configuration</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size (bytes)</label>
            <input
              type="number"
              value={newDataForm.size}
              onChange={(e) => setNewDataForm(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter size in bytes"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddData}
              disabled={!newDataForm.name}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Add Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}