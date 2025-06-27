import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ChatHeader from '../chat/ChatHeader';
import ChatMessages from '../chat/ChatMessages';
import ChatInput from '../chat/ChatInput';
import AdminPanel from '../admin/AdminPanel';

export default function Dashboard() {
  const { user } = useApp();

  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-gray-50"
    >
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </motion.div>
  );
}