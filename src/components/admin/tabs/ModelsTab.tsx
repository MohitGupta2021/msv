import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, Pause, Settings, Trash2, Plus, Activity } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Modal from '../../ui/Modal';

interface AIModel {
  id: string;
  name: string;
  type: 'GPT' | 'BERT' | 'Custom';
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  lastTrained: Date;
  parameters: string;
  usage: number;
}

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'GPT-4 Enhanced',
    type: 'GPT',
    status: 'active',
    accuracy: 95.2,
    lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    parameters: '175B',
    usage: 87
  },
  {
    id: '2',
    name: 'BERT Classifier',
    type: 'BERT',
    status: 'active',
    accuracy: 92.8,
    lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    parameters: '340M',
    usage: 64
  },
  {
    id: '3',
    name: 'Custom Domain Model',
    type: 'Custom',
    status: 'training',
    accuracy: 88.5,
    lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    parameters: '12B',
    usage: 23
  }
];

export default function ModelsTab() {
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModelStatus = (id: string) => {
    setModels(prev => prev.map(model => 
      model.id === id 
        ? { ...model, status: model.status === 'active' ? 'inactive' : 'active' }
        : model
    ));
  };

  const deleteModel = (id: string) => {
    setModels(prev => prev.filter(model => model.id !== id));
  };

  const getStatusColor = (status: AIModel['status']) => {
    switch (status) {
      case 'active': return 'completed';
      case 'inactive': return 'idle';
      case 'training': return 'processing';
      default: return 'idle';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Models</h1>
          <p className="text-gray-600">Manage and monitor your AI models</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Deploy New Model</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-500">{model.type} • {model.parameters}</p>
                </div>
              </div>
              <StatusBadge status={getStatusColor(model.status)} pulse={model.status === 'training'}>
                {model.status}
              </StatusBadge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="text-sm font-medium text-gray-900">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Usage</span>
                <span className="text-sm font-medium text-gray-900">{model.usage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Trained</span>
                <span className="text-sm font-medium text-gray-900">
                  {model.lastTrained.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleModelStatus(model.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  model.status === 'active'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {model.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{model.status === 'active' ? 'Pause' : 'Start'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedModel(model);
                  setIsModalOpen(true);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteModel(model.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${selectedModel?.name}`}
        size="lg"
      >
        {selectedModel && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                <input
                  type="text"
                  value={selectedModel.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="GPT">GPT</option>
                  <option value="BERT">BERT</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parameters</label>
              <input
                type="text"
                value={selectedModel.parameters}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}