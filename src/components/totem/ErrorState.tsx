
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Battery } from 'lucide-react';

const ErrorState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Battery className="w-16 h-16 mb-4 text-gray-300" />
      <p className="text-lg font-medium mb-2">Erro ao carregar bikes</p>
      <p className="text-sm text-center mb-4">
        Não foi possível conectar com a API. Usando dados offline.
      </p>
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Modo Offline
      </Badge>
    </div>
  );
};

export default ErrorState;
