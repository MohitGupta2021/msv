import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  FileText, 
  Brain, 
  TrendingUp, 
  Server,
  Cpu,
  HardDrive,
  Clock
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatusBadge from '../../ui/StatusBadge';
import { HEALTH_COLORS } from '../../../utils/constants';

export default function OverviewTab() {
  const { systemStatus, messages, uploadedFiles, polfData } = useApp();

  const stats = [
    {
      name: 'Active Models',
      value: systemStatus.activeModels,
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+2 this week'
    },
    {
      name: 'Total Documents',
      value: systemStatus.totalDocuments,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15 today'
    },
    {
      name: 'Chat Messages',
      value: messages.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `+${messages.length} today`
    },
    {
      name: 'POLF Datasets',
      value: polfData.length,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Stable'
    }
  ];

  const systemMetrics = [
    {
      name: 'CPU Usage',
      value: `${systemStatus.cpuUsage}%`,
      icon: Cpu,
      status: systemStatus.cpuUsage > 80 ? 'warning' : 'good'
    },
    {
      name: 'Memory Usage',
      value: `${systemStatus.memoryUsage}%`,
      icon: HardDrive,
      status: systemStatus.memoryUsage > 85 ? 'critical' : 'good'
    },
    {
      name: 'Uptime',
      value: systemStatus.uptime,
      icon: Clock,
      status: 'excellent'
    },
    {
      name: 'System Health',
      value: systemStatus.systemHealth,
      icon: Server,
      status: systemStatus.systemHealth
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h1>
        <p className="text-gray-600">Monitor your AI platform's performance and status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <StatusBadge status="excellent">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </StatusBadge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.name}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    HEALTH_COLORS[metric.status as keyof typeof HEALTH_COLORS]
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                <StatusBadge status={metric.status}>
                  {metric.status}
                </StatusBadge>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New model deployed', time: '2 minutes ago', type: 'success' },
            { action: 'Document processed', time: '5 minutes ago', type: 'info' },
            { action: 'POLF data synchronized', time: '12 minutes ago', type: 'success' },
            { action: 'System backup completed', time: '1 hour ago', type: 'success' },
            { action: 'User authentication updated', time: '2 hours ago', type: 'warning' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium text-gray-900">{activity.action}</span>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}