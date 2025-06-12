
import React from 'react';
import { Battery } from 'lucide-react';
import { DisplayTotem } from '@/types/api-totem';

interface EmptyStateProps {
  totem: DisplayTotem;
}

const EmptyState: React.FC<EmptyStateProps> = ({ totem }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Battery className="w-16 h-16 mb-4 text-gray-300" />
      <p className="text-lg font-medium mb-2">Nenhuma bike disponível</p>
      <p className="text-sm text-center">
        Este totem está {totem.status === 'maintenance' ? 'em manutenção' : 'vazio'}. 
        Tente outro totem próximo.
      </p>
    </div>
  );
};

export default EmptyState;
