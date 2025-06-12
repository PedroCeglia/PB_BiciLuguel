
import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <RefreshCw className="w-16 h-16 mb-4 text-gray-300 animate-spin" />
      <p className="text-lg font-medium mb-2">Carregando bikes do totem...</p>
    </div>
  );
};

export default LoadingState;
