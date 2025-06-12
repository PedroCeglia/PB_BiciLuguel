
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BikeGridLoadingProps {
  // No additional props needed
}

interface BikeGridErrorProps {
  onRefetch: () => void;
}

export const BikeGridLoading: React.FC<BikeGridLoadingProps> = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-8 h-8 animate-spin text-bike-primary" />
      <span className="ml-2 text-lg">Carregando bicicletas...</span>
    </div>
  );
};

export const BikeGridError: React.FC<BikeGridErrorProps> = ({ onRefetch }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <p className="text-lg font-medium mb-2">Erro ao carregar bicicletas</p>
      <p className="text-sm mb-4">Usando dados offline</p>
      <Button onClick={onRefetch} variant="outline">
        Tentar novamente
      </Button>
    </div>
  );
};
