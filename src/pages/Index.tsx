
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  console.log('🔍 Index component renderizado');
  
  const { user, isLoading } = useAuth();
  
  console.log('🔍 Index - user:', user, 'isLoading:', isLoading);

  if (isLoading) {
    console.log('🔄 Mostrando tela de loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bike-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log('🔍 Renderizando:', user ? 'Dashboard' : 'LoginPage');
  return user ? <Dashboard /> : <LoginPage />;
};

export default Index;
