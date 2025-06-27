import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { SettingsProvider } from './context/SettingsContext';
import { useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Dashboard from './components/layout/Dashboard';

function AppContent() {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  if (user) {
    return <Dashboard />;
  }

  return currentPage === 'login' ? (
    <LoginPage onNavigateToRegister={() => setCurrentPage('register')} />
  ) : (
    <RegisterPage onNavigateToLogin={() => setCurrentPage('login')} />
  );
}

export default function App() {
  return (
    <AppProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AppProvider>
  );
}